const {userService} = require('../services/user');
const {ServiceError, StatusCode} = require('../lib/error');

const ErrorCode = {
	MISMATCHING_PROFILE_EMAIL: 'mismatching_profile_email'
};

module.exports = {
	/* login: async function(req, res, next) {
		let userEmail = req.swagger.params.email.value;
		let {accessToken} = req.swagger.params.payload.value;

		try {
			let profile = await userService.getProfileInformation(accessToken);

			if(userEmail !== profile.email) {
				throw new ServiceError({
					message: 'mismatching profile email',
					statusCode: StatusCode.UNAUTHORIZED,
					code: ErrorCode.MISMATCHING_PROFILE_EMAIL
				});
			}

			res.setHeader('access-token', accessToken);
			res.cookie('access-token', accessToken, {httpOnly: true});
			res.sendData();
		} catch(err) {
			res.sendData(err);
		}

	} */

};