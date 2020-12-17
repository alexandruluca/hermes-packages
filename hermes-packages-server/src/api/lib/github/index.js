const {ServiceError, StatusCode} = require('../error');
const {accessToken, owner} = require('../config').githubApi;
const Octokit = require('@octokit/rest')
const octokit = new Octokit({
	auth: accessToken
})
const request = require('request');
const logger = require('../logger');
const {requiredParam: rp} = require('../utils');

const ErrorCode = {
	MERGING_BLOCKED: 'merging_blocked'
};

class GithubApi {
	async mergePullRequest({repo, pullId, commitTitle}) {
		commitTitle = commitTitle || commitMessage;

		let isMerged = await this.isPullRequestMerged({owner, repo, pullId});

		if (isMerged) {
			throw new ServiceError({
				message: `pull request with id='${pullId}' is already merged`,
				statusCode: StatusCode.CONFLICT,
				code: 'pull_request_merged'
			});
		}

		return octokit.pulls.merge({
			owner,
			repo,
			pull_number: pullId,
			commit_title: commitTitle,
			commit_message: commitTitle
		})
	}

	/**
	 *
	 * @param {Object} options
	 * @param {String} options.repo
	 * @param {String} options.pullId
	 */
	async isPullRequestMerged(options) {
		/* let isMergingBlocked = await this.isMergingBlocked(options);

		if (isMergingBlocked) {
			throw new ServiceError({
				message: `merging is blocked for pullId='${options.pullId}'`,
				statusCode: StatusCode.CONFLICT,
				code: ErrorCode.MERGING_BLOCKED
			});
		} */

		return octokit.pulls.checkIfMerged({
			owner,
			repo: options.repo,
			pull_number: options.pullId
		}).then(() => true).catch(() => false);
	}

	async getPullRequestState({repo, pullId}) {
		let pr = await octokit.pulls.get({
			owner,
			repo,
			pull_number: pullId
		});

		return pr.data.mergeable_state;
	}

	async isPullRequestMergeable({repo, pullId}) {

		let pr = await octokit.pulls.get({
			owner,
			repo,
			pull_number: pullId
		});

		return pr.data.mergeable === true;
	}

	async isMergingBlocked({repo, pullId}) {
		try {
			let state = await this.getPullRequestState({repo, pullId});

			return state === 'blocked';
		} catch (err) {
			return false;
		}
	}

	async isPullRequestBehind({repo, pullId}) {
		try {
			let state = await this.getPullRequestState({repo, pullId});

			return state === 'behind';
		} catch (err) {
			return false;
		}
	}

	async isPullRequestReviewed({repo, pullId}) {
		try {
			let reviews = await octokit.pulls.listReviews({
				owner,
				repo,
				pull_number: pullId
			});

			let approvingReview = reviews.data.find(review => review.state === 'APPROVED');

			return !!approvingReview;
		} catch (err) {
			if (err.status === StatusCode.NOT_FOUND) {
				throw new ServiceError({
					message: `pul-request not found for pull-id='${pullId}'`,
					statusCode: StatusCode.NOT_FOUND
				});
			}
			throw err;
		}
	}

	async mergeBranch({repo, sourceBranch = 'develop', targetBranch = 'release'}) {
		let isExistingTargetBranch = await this.isExistingBranch({
			repo,
			branch: targetBranch
		});

		if (!isExistingTargetBranch) {
			logger.info(`branch '${targetBranch}' does not exist, creating it for you`)
			await this.createBranch({
				repo,
				targetBranch,
				sourceBranch
			});
			return;
		}

		logger.info(`[${repo}]: merging '${sourceBranch}' into '${targetBranch}'`);

		return octokit.repos.merge({
			owner,
			repo,
			base: targetBranch,
			head: sourceBranch
		});
	}

	async isExistingBranch({repo, branch}) {
		try {
			await octokit.repos.getBranch({
				owner,
				branch,
				repo
			});
			return true;
		} catch (err) {
			if (err.status === 404) {
				return false;
			}

			throw err;
		}
	}

	async createBranch({repo, targetBranch, sourceBranch = 'develop'}) {
		logger.info(`[${repo}]: creating branch '${targetBranch}' based of '${sourceBranch}'`);

		if (targetBranch.indexOf('refs/heads/') === -1) {
			targetBranch = `refs/heads/${targetBranch}`;
		}

		let branchSha = await this.getBranchSha({
			repo,
			branch: sourceBranch
		});

		return octokit.git.createRef({
			owner,
			repo,
			ref: targetBranch,
			sha: branchSha
		});
	}

	deleteBranch({repo, ref}) {
		if (ref.indexOf('heads/') === -1) {
			ref = `heads/${ref}`;
		}

		return octokit.git.deleteRef({
			owner,
			repo,
			ref
		});
	}

	/**
	 * Gets last commit of a branch
	 * @param {Object} options
	 * @param {String} options.repo
	 * @param {String} options.branch
	 */
	getBranchSha({repo, branch}) {
		if (!branch.startsWith('heads/')) {
			branch = `heads/${branch}`;
		}

		return octokit.git.getRef({
			owner,
			repo,
			ref: branch
		}).then(res => res.data.object.sha)
	}

	async getIssue({repo, issueNumber}) {
		let res = await octokit.issues.get({
			owner,
			repo,
			issue_number: issueNumber
		});
		if (res.data.pull_request) {
			throw new Error('No issue found.');
		}
		return res.data;
	}

	updateIssue({repo, issueNumber, state}) {
		logger.info(`Updating issue, ${repo}, ${issueNumber}, ${state}`);
		return octokit.issues.update({
			owner,
			repo,
			state,
			issue_number: issueNumber
		})
	}

	async isValidIssue({repo, issueNumber}) {
		try {
			let a = await this.getIssue({repo, issueNumber});
			return true;
		} catch (err) {
			return false;
		}
	}

	async createRelease({repo, tagName, file}) {
		let releases = await this.getReleases(repo);
		let tagRelease = releases.find(r => r.tag_name === tagName);

		if (tagRelease) {
			await this.deleteRelease({repo, releaseId: tagRelease.id});
		}

		let {data} = await octokit.repos.createRelease({
			owner,
			repo,
			tag_name: tagName
		});

		if (!file) {
			return file;
		}

		let res = await octokit.repos.uploadReleaseAsset({
			file,
			headers: {'content-length': file.length, "content-type": 'application/zip'},
			name: 'deployment-package',
			url: data.upload_url
		})

		return data;
	}

	async getReleases(repo) {
		let {data} = await octokit.repos.listReleases({
			owner,
			repo
		});
		return data;
	}

	async downloadDeployment({repo, tagName}) {
		let releases = await this.getReleases(repo);
		let release = releases.find(r => r.tag_name === tagName);

		if (!release) {
			throw new Error('Not found');
		}
		let assetId = release.assets[0].id;

		let url = `https://${accessToken}:@api.github.com/repos/${owner}/${repo}/releases/assets/${assetId}`;

		return request({
			url,
			headers: {
				'Accept': 'application/octet-stream',
				'User-Agent': 'request module'
			},
			encoding: null
		});
	}

	deleteRelease({repo, releaseId}) {
		return octokit.repos.deleteRelease({
			owner,
			repo,
			release_id: releaseId
		});
	}

	getRepo(repo) {
		return octokit.repos.get({
			repo,
			owner
		})
	}
};

const githubApi = new GithubApi();

class BranchApi {
	/**
	 * @param {Object} options
	 * @param {String} options.repo
	 * @param {String} options.userEmail
	 */
	// @ts-ignore
	constructor({repo = rp('repo'), userEmail = rp('userEmail')}) {
		this.repo = repo;
		this.userEmail = userEmail;
		this.api = githubApi;
		this.branchSha = null;
		this.initialized = false;
	}

	/**
   * @param {String} path
   * @private
   */
	normalizePath(path) {
		if (path.startsWith('./')) {
			path = path.substring(2);
		}
		return path;
	}

	/**
	 * @param {String} ref
	 * @private
	 */
	normalizeRef(ref) {
		if (!ref.startsWith('refs/heads/')) {
			ref = `refs/heads/${ref}`;
		}
		return ref;
	}

	/**
	 * @param {Object} options
	 * @param {String} options.ref
	 * @param {String} options.path
	 * @returns Object {sha: string, content: string}
	 */
	async getContents({ref, path}) {
		path = this.normalizePath(path);
		ref = this.normalizeRef(ref);

		let content = await octokit.repos.getContents({
			owner,
			path,
			ref,
			repo: this.repo
		})

		let fileContent = Buffer.from(content.data.content, 'base64').toString('utf8');

		if (path.endsWith('.json')) {
			try {
				fileContent = JSON.parse(fileContent);
			} catch (err) {
				// no action
			}
		}

		return {
			content: fileContent,
			sha: content.data.sha
		};
	}

	async putContents({ref, path, content, message = '[ci skip] - automatic version bump'}) {
		if (typeof content === 'object') {
			content = JSON.stringify(content, null, "\t");
		}

		ref = this.normalizeRef(ref);

		// we need to read the file in order to get the sha
		let {sha} = await this.getContents({ref, path});

		content = Buffer.from(content).toString('base64');

		path = this.normalizePath(path);

		return octokit.repos.createOrUpdateFile({
			owner,
			repo: this.repo,
			path,
			message,
			content,
			sha,
			branch: ref
		})
	}

	mergePullRequest(pullId, sourceBranch, targetBranch) {
		return this.api.mergePullRequest({
			pullId,
			repo: this.repo,
			commitTitle: `Merge ${sourceBranch} into ${targetBranch}`
		});
	}

	mergeBranch({sourceBranch, targetBranch}) {
		return this.api.mergeBranch({
			sourceBranch,
			targetBranch,
			repo: this.repo
		});
	}

	deleteBranch({branch}) {
		return this.api.deleteBranch({
			ref: branch,
			repo: this.repo
		});
	}
}

exports.githubApi = githubApi;
exports.BranchApi = BranchApi;