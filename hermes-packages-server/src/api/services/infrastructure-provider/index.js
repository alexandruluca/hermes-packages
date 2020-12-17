const logger = require('../../lib/logger');
const {awsProviderService} = require('./aws/AwsProviderService');
const {onPremProviderService} = require('./OnPremProviderService');

const PROVIDER_LIST = ['aws', 'on-premise'];

exports.getInstance = getInstance;
exports.PROVIDER_LIST = PROVIDER_LIST;

exports.getAllInstances = function () {
	return PROVIDER_LIST.map(providerType => getInstance(providerType));
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