const logger = require('../../lib/logger');
const {awsProviderService} = require('./aws/AwsProviderService');
const {onPremProviderService} = require('./OnPremProviderService');

/**
 * @param {'aws' | 'on-premise'} type
 */
exports.getInstance = function getInstance(type) {
	logger.info(`initializing infrastructure provider service type ${type}`);
	if (type === 'aws') {
		return awsProviderService;
	}
	if (type === 'on-premise') {
		return onPremProviderService;
	}

	throw new Error(`provider type ${type} not supported`);
}