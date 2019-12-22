const REGULAR_DEPLOYMENT = {
	"version": "5.1.107",
	"band": "develop",
	"isHotfix": false,
	"name": "tag-test"
};

const REGULAR_PULL_REQUEST_DEPLOYMENT = {
	"version": "5.1.107",
	"band": "develop",
	"isHotfix": false,
	"name": "tag-test",
	"pullRequestMeta": {
		"actualCommit": "3a43f8ae00bfb7f755142fe5e11ff54403f155f7",
		"actualCommitAuthor": "luca",
		"actualCommitAuthorEmail": "luca",
		"pullDescription": "GitHub pull request #23 of commit",
		"pullId": "23",
		"pullLink": "https://github.com/alexandruluca/pull-request-builder/pull/23",
		"pullTitle": "test",
		"sourceBranch": "LBS-798",
		"targetBranch": "develop",
		"sha1": "origin/pr/23/merge"
	}
}

const MOBILE_APP_DEPLOYMENT = 	{
	"version": "5.1.107",
	"iosCfBundleId": "144",
	"androidVersionCode": "144",
	"isPullRequest": true,
	"band": "develop",
	"isHotfix": false,
	"name": "tag-test-mobile-app"
};

const MOBILE_APP_PULL_REQUEST_DEPLOYMENT = 	{
	"version": "5.1.107",
	"iosCfBundleId": "144",
	"androidVersionCode": "144",
	"isPullRequest": true,
	"band": "develop",
	"isHotfix": false,
	"name": "tag-test-mobile-app",
	"pullRequestMeta": {
		"actualCommit": "3a43f8ae00bfb7f755142fe5e11ff54403f155f7",
		"actualCommitAuthor": "luca",
		"actualCommitAuthorEmail": "luca",
		"pullDescription": "GitHub pull request #23 of commit",
		"pullId": "23",
		"pullLink": "https://github.com/alexandruluca/pull-request-builder/pull/23",
		"pullTitle": "test",
		"sourceBranch": "LBS-798",
		"targetBranch": "develop",
		"sha1": "origin/pr/23/merge"
	}
};

const Deployment = {
	RegularDeployment: () => clone(REGULAR_DEPLOYMENT),
	RegularPullRequestDeployment: () => clone(REGULAR_PULL_REQUEST_DEPLOYMENT),
	MobileAppDeployment: () => clone(MOBILE_APP_DEPLOYMENT),
	MobileAppPullRequestDeployment: () => clone(MOBILE_APP_PULL_REQUEST_DEPLOYMENT)
};

exports.Deployment = Deployment;

function clone(o) {
	return JSON.parse(JSON.stringify(o));
}