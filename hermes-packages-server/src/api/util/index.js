const semver = require('semver');
const BANDS = ['develop', 'release', 'qa', 'production'];

exports.getSemverCmpFunction = getSemverCmpFunction;
exports.validateBand = validateBand;
exports.normalizeVersion = normalizeVersion;
exports.denormalizeVersion = denormalizeVersion;
exports.validateRequiredParam = validateRequiredParam;
/**
 *
 * @param {String} field
 * @param {Object} options
 * @param {Boolean} options.asc
 * @return {function(*, *)}
 */
function getSemverCmpFunction(field, options) {
	var isAscending = options && options.asc !== false;

	return (a, b) => {
		var versionA = a[field];
		var versionB = b[field];

		if (semver.gt(versionA, versionB)) {
			return isAscending ? 1 : -1;
		}
		if (semver.gt(versionB, versionA)) {
			return isAscending ? -1 : 1;
		}
		return 0;
	};
}

function validateBand(band) {
	if (BANDS.indexOf(band) === -1) {
		throw new Error(`band '${band}' is not supported, only [${BANDS}] are valid`);
	}
}

function normalizeVersion(version, band) {
	if (!version) {
		throw new Error('missing version param');
	}
	if (!band) {
		throw new Error('missing band param');
	}

	version = semver.coerce(version);

	return `${version}-${band}`;
}

function denormalizeVersion(version) {
	return semver.valid(semver.coerce(version).version);
}

function validateRequiredParam(param, paramName) {
	if ([null, undefined, ''].includes(param)) {
		throw new Error(`missing value for param: ${paramName}`);
	}
}