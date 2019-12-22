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

app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', viewsDir);
app.set('view engine', 'hbs');

const port = config.port;

swaggerTools.initializeMiddleware(require('./api/specs.json'), function (middleware) {
	const routerOptions = {
		swaggerUi: '/swagger.json',
		controllers: path.join(__dirname, 'api/controllers')
	};

	app.use(cookieParser());

	app.use(cors({
		exposedHeaders: 'access-token'
	}));

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
		res.end(JSON.stringify(config.webClientConfig));
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