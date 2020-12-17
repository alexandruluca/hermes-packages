/**
 *
 * @typedef {Object} Deployment
 * @property {PullRequestMeta=} pullRequestMeta
 * @property {String=} version
 * @property {String=} name
 * @property {String=} band
 * @property {String=} id
 * @property {String=} iosCfBundleId
 * @property {String=} androidVersionCode
 * @property {Boolean=} isMobileApplicationDeployment
 * @property {Boolean=} isHotfix
 * @property {String} serverTag
 * @property {Boolean} deployAsAwsLambdaFunction
 * @property {Boolean} isProduction
 */

/**
  *
  * @typedef {Object} PullRequestMeta
  * @property {String=} actualCommit
  * @property {String=} pullId
  * @property {String=} pullDescription
  * @property {String=} pullLink
  * @property {String=} pullTitle
  * @property {String=} sourceBranch
  * @property {String=} targetBranch
  * @property {String=} issueNumber
  * @property {String=} sha1
  * @property {String=} status
  */

/**
  * @typedef {Object} DeploymentSequence
  * @property {String} deploymentName
  * @property {String} band
  * @property {VersionSequence} sequence
 */

/**
  * @typedef {Object} VersionSequence
  * @property {String=} version
  * @property {String=} iosCfBundleId
  * @property {String=} androidVersionCode
  */

/**
  * @typedef {Object} TaskStatusResult
  * @property {String} name
  */

/**
  * @typedef {Object} Project
  * @property {String} id
  * @property {String} name
  * @property {Stage[]} stages
  */

/**
  * @typedef {Object} Stage
  * @property {String} id
  * @property {String} name
  * @property {'on-premise' | 'aws'} type
  * @property {'develop' | 'qa' | 'release' |'production'} band
  * @property {'lambda' | 's3' | null} resourceType
  * @property {'nodejs' | null} runtime
  * @property {String} resourceName
  * @property {String[]} regions
  */

/**
 * @typedef {Object} DeploymentContext
 * @property {String} band
 * @property {String} deploymentName
 */

/**
* @typedef {Object} DeploymentState
* @property {String} projectId
* @property {String} stageId
* @property {String} deploymentId
*/