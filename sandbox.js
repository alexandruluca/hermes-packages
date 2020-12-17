const request = require('request-promise');

const config = 	{
	"username": "hermes-packages",
	"password": "yV)$EUve++?@7sPp",
	"url": "https://integration-lbd5-jenkins.hermes.com",
	"secret": "my-super-secret-token"
};

const {username, password, url, secret} = config;
const CRUMB_URL = `${url}/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)`;

const auth = {
	user: username,
	pass: password
};

class JenkinsApi {
	async isExistingJob(jobName) {
		try {
			const jobUrl = `${url}/job/${jobName}/api/json`
			await request(jobUrl, {
				auth,
				method: "GET"
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	/**
	 * Trigger a jenkins build job remotely
	 */
	async triggerRemoteBuild(jobName) {
		let crumb = await this.getCrumb();
		let buildUrl = this.getBuildUrl(jobName);

		return request(buildUrl, {
			headers: {
				[crumb.header]: crumb.value
			},
			auth: {
				user: username,
				pass: password
			},
			method: "POST"
		});
	}

	/**
	 * Get crumb for CSRF protection
	 * @private
	 */
	getCrumb() {
		return request(CRUMB_URL, {
			method: "GET",
			auth: {
				user: username,
				pass: password
			}
		}).then(crumbRes => {
			let [header, value] = crumbRes.split(':');

			return {
				header,
				value
			}
		});
	}

	/**
	 * @private
	 * @param {String} projectName
	 */
	getBuildUrl(projectName) {
		let buildUrl = `${url}/job/${projectName}/build`;

		if (secret) {
			buildUrl += `?token=${secret}`;
		}

		return buildUrl;
	}
};

const api = new JenkinsApi();

(async function() {
	let exists = await api.isExistingJob('hermes-cms-scheduler-release')
	console.log('exists', exists);
})();