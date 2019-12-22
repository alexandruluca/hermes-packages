const path = require('path');
const loki = require('lokijs');
const databaseDir = require('../config').databaseDir;

const DB_NAME = path.join(databaseDir, 'hermes-packages.json');

const isTestEnv = process.env.NODE_ENV === 'test';

class DatabaseFactory {
	static getInstance() {
		return new Promise((resolve, reject) => {
			const db =  new loki(DB_NAME, {
				clone: true,
				autoload: true,
				autoloadCallback: () => resolve(db),
				autosave: true,
				autosaveInterval: 500,
				adapter: this.getPersistanceAdapter()
			});
		});
	}

	static getPersistanceAdapter() {
		if(!isTestEnv) {
			return null;
		}

		return new loki.LokiMemoryAdapter();
	}
}

exports.DatabaseFactory = DatabaseFactory;