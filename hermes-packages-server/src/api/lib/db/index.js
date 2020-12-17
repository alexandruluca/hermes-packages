
const loki = require('lokijs');
const uuid = require('uuid');
const Ajv = require('ajv');
const ajv = new Ajv();
const {DatabaseFactory} = require('./DatabaseFactory');

loki.Collection.prototype.insert = (function (original) {
	return function (doc) {
		if (this.validate && !this.validate(doc)) {
			throw new Error(extractErrorMessages(this.validate.errors));
		}
		doc.createdAt = new Date().toJSON();
		doc.id = uuid.v4();
		return original.apply(this, arguments);
	};
})(loki.Collection.prototype.insert);

loki.Collection.prototype.update = (function (original) {
	return function (doc) {
		if (this.validate && !this.validate(doc)) {
			throw new Error(extractErrorMessages(this.validate.errors));
		}

		doc.updatedAt = new Date().toJSON();
		return original.apply(this, arguments);
	};
})(loki.Collection.prototype.update);

function extractErrorMessages(errors) {
	return errors.map(function (err) {
		let msg = `${err.dataPath.substring(1)} ${err.message}`;

		if (err.params.allowedValues) {
			msg += `: [${err.params.allowedValues.join(', ')}]`;
		}
		return msg;
	});
}

let db = null;

module.exports.initializeDatabase = function () {
	if (db) {
		return Promise.resolve();
	}

	return DatabaseFactory.getInstance().then(dbInstance => {
		db = dbInstance;
	});
};

module.exports.initCollection = function (name, schema) {
	if (!db) {
		throw new Error('database not yet initialized');
	}
	return initCollection(name, schema);
};

function initCollection(name, schema) {
	var collInstance = db.getCollection(name);

	if (collInstance === null) {
		collInstance = db.addCollection(name, {clone: true});
	}

	collInstance.validate = ajv.compile(schema);

	return new Collection(collInstance);
}

class Collection {
	constructor(lokiCollection) {
		this.collection = lokiCollection;
	}

	insert(o) {
		this.collection.insert(o);
	}

	update(o) {
		this.collection.update(o);
	}

	findOne(query) {
		let obj = this.collection.findOne(query);

		return clone(obj);
	}

	upsert(query, obj) {
		let existingObj = this.findOne(query);

		if (existingObj) {
			let fullObject = Object.assign(existingObj, obj);
			this.update(fullObject);
		} else {
			let fullObject = Object.assign(query, obj);
			this.insert(fullObject);
		}
	}

	distinct(property, query) {
		let docs = this.collection.find(query);

		let items = docs.reduce((itemMap, item) => {
			if (item.hasOwnProperty(property) && !itemMap[property]) {
				itemMap[item[property]] = item;
			}
			return itemMap;
		}, {});

		return Object.keys(items);
	}

	find(query, {sort, limit} = {}) {
		let chain = this.collection.chain().find(query);

		if (sort) {
			chain = chain.sort(sort);
		}

		if (limit) {
			chain = chain.limit(limit);
		}

		let items = chain.data();

		return items.map(item => clone(item));
	};

	remove(query) {
		if (!query || Object.keys(query).length === 0) {
			throw new Error('missing query');
		}

		if (query.$loki) {
			return this.collection.remove(query);
		}

		return this.collection.chain().find(query).remove();
	}

	chain() {
		return this.collection.chain();
	}
}

function clone(obj) {
	if (!obj) {
		return obj;
	}
	return JSON.parse(JSON.stringify(obj));
}