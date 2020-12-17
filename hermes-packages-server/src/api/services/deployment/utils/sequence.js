const semver = require('semver');
const {denormalizeVersion} = require('../../../util');

const INCREMENT_TYPE = {
	PATCH: 'patch',
	MAJOR: 'major'
};

const SEQUENCES = {
	version: INCREMENT_TYPE.PATCH,
	iosCfBundleId: INCREMENT_TYPE.MAJOR,
	androidVersionCode: INCREMENT_TYPE.MAJOR
};

exports.SEQUENCES = SEQUENCES;
exports.getSequence = getSequence;

function getSequence(seedValue, latestVersion, incrementType = INCREMENT_TYPE.PATCH) {
	seedValue = denormalizeVersion(seedValue);
	latestVersion = denormalizeVersion(latestVersion);

	if (semver.gt(seedValue, latestVersion)) {
		let temp = seedValue;
		seedValue = latestVersion;
		latestVersion = temp;
	}

	let nextVersion = semver.inc(latestVersion, incrementType);

	if (incrementType === INCREMENT_TYPE.MAJOR) {
		return semver.major(nextVersion) + '';
	}

	return nextVersion;
}