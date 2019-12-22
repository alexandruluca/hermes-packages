exports.isExistingDeploymentByPullRequestId = isExistingDeploymentByPullRequestId;

function isExistingDeploymentByPullRequestId(deploymentObject, pullRequestMeta) {
	if (!deploymentObject.pullRequestMeta || !pullRequestMeta) {
		return false;
	}

	return deploymentObject.pullRequestMeta.pullId === pullRequestMeta.pullId;
}