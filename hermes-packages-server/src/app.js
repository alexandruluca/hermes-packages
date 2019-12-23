process.env["RUNNING_SWAGGER_TOOLS_TESTS"] = "true";

const path = require('path');
const config = require('./api/lib/config');
const authentication = require('./api/lib/authentication');
const express = require('express');
const app = express();
const http = require('http');
const swaggerTools = require('swagger-tools');
const hbs = require('express-handlebars');
const io = require('./api/lib/io');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const viewsDir = path.join(__dirname, 'views');
const logger = require('./api/lib/logger');
const request = require('request-promise');
const session = require("express-session");
const {clientId, clientSecret, callback} = config.githubApi;
const isDevelopment = process.env.NODE_ENV === 'DEVELOPMENT';

app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', viewsDir);
app.set('view engine', 'hbs');
app.use(
	session({
		secret: "helloworld",
		resave: true,
		saveUninitialized: false
	})
);

const port = config.port;

swaggerTools.initializeMiddleware(require('./api/specs.json'), function (middleware) {
	const routerOptions = {
		swaggerUi: '/swagger.json',
		controllers: path.join(__dirname, 'api/controllers')
	};

	app.use(cookieParser());

	if (isDevelopment) {
		app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
	} else {
		app.use(cors());
	}

	app.get('/api', (req, res, next) => {

		res.send(JSON.stringify(require('./api/specs'), null, 4));
	});

	app.use((req, res, next) => {
		res.sendData = (obj, statusCode) => {
			res.setHeader('Content-Type', 'application/json');

			if (!obj && obj !== false) {
				obj = {};
			}
			statusCode = statusCode || 200;

			if (obj instanceof Error || obj.statusCode) {
				let errCode = obj.errorCode || obj.code;
				res.statusCode = obj.statusCode || 500;

				if (!(res.statusCode >= 400 && res.statusCode <= 499)) {
					console.error(obj);
				}

				res.end(JSON.stringify({
					success: false,
					message: obj.message,
					errorCode: errCode,
					errors: obj.errors
				}, null, 4));

				return
			}

			res.statusCode = statusCode;

			res.end(JSON.stringify({
				success: statusCode >= 200 && statusCode <= 299,
				data: obj
			}, null, 4))
		};

		next();
	});

	app.get('/api/config', (req, res, next) => {
		config.webClientConfig.apiUrl = 'test';
		res.end(JSON.stringify(config.webClientConfig));
	});

	app.get('/api/authorize', async(req, res, next) => {
		console.log('auth')
		const AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
		const REDIRECT_URI = callback;
		const ENCODED_REDIRECT_URI = encodeURIComponent(REDIRECT_URI);
		const redirectUrl = `${AUTHORIZE_URL}?scope=repo&client_id=${clientId}&redirect_uri=${ENCODED_REDIRECT_URI}`;

		console.log(redirectUrl);
		res.redirect(redirectUrl);
	});

	app.get('/api/callback', async(req, res, next) => {
		console.log('cb');
		const {code} = req.query;

		try {
			let body = await request(
				{
					uri: 'https://github.com/login/oauth/access_token',
					method: "POST",
					form: {
						client_id: clientId,
						client_secret: clientSecret,
						code: code,
						redirect_uri: callback
					}
				}
			);

			const access_token = body.split("&")[0].split("=")[1];
			let data = getData(req, res, access_token);
		} catch (err) {
			res.status(500).json({message: err.message});
		}

	});

	/**
     * Swagger meta
     */
	app.use(middleware.swaggerMetadata());

	app.use((req, res, next) => {
		if (!req.swagger || !req.swagger.operation) {
			return next();
		}
		var operation = req.swagger.operation;

		logger.debug(`${req.method} ${operation.tags}:${operation.operationId}`);
		next();
	});

	/**
     * Swagger validatir
     */
	app.use(middleware.swaggerValidator());

	/**
     * Swagger security
     */
	app.use(middleware.swaggerSecurity(authentication));

	app.use(authentication.errHandler());

	/**
     * Swagger router
     */
	app.use(middleware.swaggerRouter(routerOptions));
	/**
     * Swagger ui
     */
	app.use('/api', middleware.swaggerUi());

	var server = http.createServer(app).listen(port, function () {
		console.info('Your server is listening on port ' + port + ' (http://localhost:' + port + '/api)');
		console.info('Swagger-ui is available on http://localhost:' + port + '/api/docs');
	});

	io.initialize(server);
});

const getData = async (req, res, access_token) => {
	const API_URL = "https://api.github.com/user";

	let body = await request(
		{
			uri: `${API_URL}?access_token=${access_token}`,
			method: "GET",
			headers: {
				"User-Agent": "test"
			}
		}
	);

	req.session.currentUser = JSON.parse(body);

	if (isDevelopment) {
		res.redirect('http://localhost:4200');
	} else {
		res.redirect('/');
	}
};