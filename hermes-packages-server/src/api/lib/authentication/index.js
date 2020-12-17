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
			req.session.user = {
				email: config.user.username
			}

			callback(false);
		} else {
			callback(new Error('bad credentials'));
		}
	},
	'user-session': async function (req, authOrSecDef, scopesOrApiKey, callback) {
		try {
			let user = req.session.user;

			if (!user) {
				throw new Error('Not authenticated.');
			}

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

			console.error(JSON.stringify(errOut, null, 4));

			res.status(400).end(JSON.stringify(errOut, null, 4));
		};
	}
};
