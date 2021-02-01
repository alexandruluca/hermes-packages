const {BranchApi} = require('../github');
const {githubOwner} = require('../../../api/lib/config');

const branchApi = new BranchApi({
	repo: `${githubOwner}-hq`,
	userEmail: null
});

class GistAdapter {
	constructor() {
		console.log('init gist adapter');
	}
	async loadDatabase(dbname, callback) {
		// using dbname, load the database from wherever your adapter expects it

		let {content} = await branchApi.getContents({ref: 'develop', path: 'hermes-deployment-meta.json'});

		var success = true; // make your own determinations

		if (success) {
			callback(JSON.stringify(content));
			console.log('db was loaded');
		} else {
			let message = "There was a problem loading the database";
			console.log(message);
			callback(new Error(message));
		}
	}

	async saveDatabase(dbname, dbstring, callback) {
		console.log('saving db');
		dbstring = JSON.stringify(JSON.parse(dbstring), null, 4);

		await branchApi.putContents({ref: 'develop', path: 'hermes-deployment-meta.json', content: dbstring});

		console.log('db was saved');

		var success = true;
		if (success) {
			callback(null);
		} else {
			callback(new Error("An error was encountered loading " + dbname + " database."));
		}
	}
}

exports.GistAdapter = GistAdapter;