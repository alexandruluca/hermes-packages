const {APP_DEPLOYMENT_PROPERTY} = require('../const');

exports.isMobileApplicationDeployment = isMobileApplicationDeployment;

function isMobileApplicationDeployment(deployment) {
	return deployment.hasOwnProperty(APP_DEPLOYMENT_PROPERTY.ANDROID_VERSION_CODE) ||
		deployment.hasOwnProperty(APP_DEPLOYMENT_PROPERTY.IOS_BUNDLED_ID);
}