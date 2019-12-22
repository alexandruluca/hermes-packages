const db = require('../db');

module.exports = function (collectionName, schema) {
	return db.initCollection(collectionName, schema);
};