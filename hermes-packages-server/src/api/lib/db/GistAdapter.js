const {BranchApi} = require('../github');
const {githubOwner} = require('../../../api/lib/config');

const branchApi = new BranchApi({
	repo: `${githubOwner}-hq`,
	userEmail: null
});

class GistAdapter {
	async loadDatabase(dbname, callback) {
		// using dbname, load the database from wherever your adapter expects it

		let {content} = await branchApi.getContents({ref: 'develop', path: 'hermes-deployment-meta.json'});

		var success = true; // make your own determinations

		if (success) {
			callback(JSON.stringify(content));
		} else {
			callback(new Error("There was a problem loading the database"));
		}
	}

	async saveDatabase(dbname, dbstring, callback) {
		dbstring = JSON.stringify(JSON.parse(dbstring), null, 4);

		await branchApi.putContents({ref: 'develop', path: 'hermes-deployment-meta.json', content: dbstring});

		var success = true;
		if (success) {
			callback(null);
		} else {
			callback(new Error("An error was encountered loading " + dbname + " database."));
		}
	}
}

exports.GistAdapter = GistAdapter;