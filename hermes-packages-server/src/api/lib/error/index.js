class ServiceError extends Error {
	/**
	 *
	 * @param {Object} options
	 * @param {String} options.message
	 * @param {Number} options.statusCode
	 * @param {String=} options.code
	 * @param {String[]=} options.errors
	 */
	constructor({message, statusCode, code, errors}) {
		super(message);

		this.message = message;
		this.statusCode = statusCode;
		this.errors = errors;
		this.code = code;
	}
}

const StatusCode = {
	SUCCESS: 200,
	RESOURCE_CREATED: 201,
	RESOURCE_UPDATED: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	CONFLICT: 409,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503
};

exports.ServiceError = ServiceError;
exports.StatusCode = StatusCode;