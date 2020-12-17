const db = require('./api/lib/db');
const fs = require('fs');
const path = require('path');
const logger = require('./api/lib/logger');

db.initializeDatabase().then(() => {
	const migrationColl = require('./api/collections/migration');
	const migrations = getMigrations();

	migrations.forEach(({version, description, run: runMigration}) => {
		let existingMigration = migrationColl.findOne({version});

		if (!existingMigration) {
			logger.info(`running "migration ${version}:${description}"`);
			runMigration();

			migrationColl.insert({
				version,
				description
			});
		} else {
			logger.info(`migration "${version}:${description}" already run`);
		}
	});
	require('./app');
});

function getMigrations() {
	const migrationDir = path.join(__dirname, './api/migrations');

	let files = fs.readdirSync(migrationDir);

	return files.filter(fileName => fileName.endsWith('.js')).map(fileName => {
		let migration = require(path.join(migrationDir, fileName));
		migration.version = fileName;
		return migration;
	});
}