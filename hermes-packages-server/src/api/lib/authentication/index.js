const auth = require('basic-auth');
const config = require('../config');
const {userService} = require('../../services/user');
const {ServiceError, StatusCode} = require('../error');

module.exports = {
	basicAuth: function (req, authOrSecDef, scopesOrApiKey, callback) {
		var authentication = auth(req);
		if (!authentication) {
			callback(new Error('missing credentials'));
			return;
		}
		req.auth = {
			user: authentication.name,
			password: authentication.pass
		};
		if (req.auth.user === config.user.username && req.auth.password === config.user.password) {
			req.session = {
				user: {
					email: config.user.username
				}
			};

			callback(false);
		} else {
			callback(new Error('bad credentials'));
		}
	},
	'access-token': async function (req, authOrSecDef, scopesOrApiKey, callback) {
		try {
			const accessToken = req.cookies['access-token'] || req.headers['access-token'];

			if (!accessToken) {
				throw new ServiceError({
					message: 'missing access-token',
					code: 'missing-access-token',
					statusCode: StatusCode.UNAUTHORIZED
				});
			}
			let user = await userService.getProfileInformation(accessToken);

			req.session = {
				user
			};

			callback(false);
		} catch (err) {
			callback(err);
		}
	},
	errHandler: () => {
		return (err, req, res, next) => {
			if (err.statusCode === 403) {
				res.statusCode = 403;
				var out = {
					message: 'missing/invalid authorization: ' + err.message,
					code: err.code,
					statusCode: err.statusCode
				};
				res.end(JSON.stringify(out));
				return;
			}

			let errOut = {message: err.message};
			if (err.results) {
				err.message = `param ${err.paramName} failed validation:\n` + err.results.errors.map(err => `${err.message} at path ${err.path}`).join('\n');
				errOut.errors = err.results.errors;
			}

			console.error(errOut);

			res.status(400).end(JSON.stringify(errOut));
			return;
		};
	}
};
