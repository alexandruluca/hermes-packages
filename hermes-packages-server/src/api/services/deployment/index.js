const {DeploymentService, ErrorCode, DeploymentBand, PullRequestStatus} = require('./DeploymentService');

exports.ErrorCode = ErrorCode;
exports.deploymentService = new DeploymentService();
exports.DeploymentBand = DeploymentBand;
exports.PullRequestStatus = PullRequestStatus;