const Loki = require('lokijs');
const {GistAdapter} = require('./GistAdapter');
const DB_NAME = 'hermes-packages.json';

const isTestEnv = process.env.NODE_ENV === 'test';

class DatabaseFactory {
	static getInstance() {
		return new Promise((resolve, reject) => {
			let opt = {
				clone: true,
				autoload: true,
				autoloadCallback: () => resolve(db),
				autosave: true,
				autosaveInterval: 100,
				adapter: this.getPersistanceAdapter()
			}
			if (!opt.adapter) {
				delete opt.adapter;
			}
			const db = new Loki(DB_NAME, opt);
		});
	}

	static getPersistanceAdapter() {
		if (isTestEnv) {
			return new Loki.LokiMemoryAdapter();
		}

		return new GistAdapter()
	}
}

exports.DatabaseFactory = DatabaseFactory;