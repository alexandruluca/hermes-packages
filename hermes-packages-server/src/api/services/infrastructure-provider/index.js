const logger = require('../../lib/logger');
const {awsProviderService} = require('./aws/AwsProviderService');
const {onPremProviderService} = require('./OnPremProviderService');

exports.getInstance = getInstance;

exports.getAllInstances = function () {
	return [
		getInstance('aws'),
		getInstance('on-premise')
	];
}

/**
 * @param {'aws' | 'on-premise'} type
 */
function getInstance(type) {
	logger.info(`initializing infrastructure provider service type ${type}`);
	if (type === 'aws') {
		return awsProviderService;
	}
	if (type === 'on-premise') {
		return onPremProviderService;
	}

	throw new Error(`provider type ${type} not supported`);
}