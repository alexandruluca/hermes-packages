const request = require('request-promise');
const GAPI_PROFILE_URL = accessToken => `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`;
const {ServiceError, StatusCode} = require('../../lib/error');
const hermes_GROUP = 'hermes.com';

const ErrorCode = {
	INVALID_ACCESS_TOKEN: 'invalid_access_token'
};

class UserService {
	async getProfileInformation(accessToken) {
		return request.get(GAPI_PROFILE_URL(accessToken)).then(profile => {
			profile = JSON.parse(profile);
			if(profile.hd !== hermes_GROUP) {
				throw new ServiceError(`invalid group`, StatusCode.UNAUTHORIZED);
			}
			return {
				email: profile.email,
				name: profile.name
			}
		}).catch(err => {
			let message = err.message;
			if (err.error) {
				try {
					message = new ServiceError({
						message: JSON.parse(err.error).error_description,
						statusCode: StatusCode.UNAUTHORIZED
					});
				} catch (err1) {
					// no op
				}
			}

			throw new ServiceError({
				message,
				statusCode: StatusCode.UNAUTHORIZED,
				code: ErrorCode.INVALID_ACCESS_TOKEN
			});
		})
	}
}

exports.UserService = UserService;