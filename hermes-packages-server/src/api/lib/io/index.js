const EventEmitter = require('events'); var socket;
const io = require('socket.io');
const connectedClients = {};
const WEB_CLIENT_ROOM_NAME = 'web-client';
const logger = require('../logger');
const Event = {
	PACKAGE_UPDATER_CONNECTED: 'package-updater-connected',
	APPLCATION_UPDATED: 'application-updated'
}

class EventHandler extends EventEmitter {
	initialize(server) {
		this.socket = io(server);
		this.setupEvents();
	}

	setupEvents() {
		const socket = this.socket;
		socket.on('connection', (socket) => {
			this.handleClientConnection(socket);
		});
	}

	handleClientConnection(clientSocket) {
		const serverTag = clientSocket.handshake.query.serverTag;
		const isWebClient = !!clientSocket.handshake.query['web-client'];
		const isProduction = clientSocket.handshake.query.isProduction === true;
		const band = isProduction ? 'production' : clientSocket.handshake.query.band;

		if (!isWebClient) {
			logger.debug(`client connected: ${serverTag}:${band}`);
			this.emitWebClientEvent(Event.PACKAGE_UPDATER_CONNECTED);
		}

		if (isWebClient) {
			logger.debug('web client connected');
			clientSocket.join(WEB_CLIENT_ROOM_NAME);
			return;
		}

		connectedClients[serverTag] = {
			band,
			isProduction,
			socket: clientSocket,
			deploymentMeta: []
		};

		clientSocket.on('disconnect', () => {
			for (let serverTag in connectedClients) {
				if (connectedClients[serverTag] === socket) {
					delete connectedClients[serverTag];
					break;
				}
			}
		});

		clientSocket.on('application-bootstrap', (deploymentMeta) => {
			logger.debug(`${serverTag} emited 'application-bootstrap' event`);
			connectedClients[serverTag].deploymentMeta = deploymentMeta;

			this.emitWebClientUpdateAvailable();
		});

		clientSocket.on('application-updated', (incomingAppMeta) => {
			logger.debug(`${serverTag} emited 'application-updated' event`);
			// isUpdating: false gets set here

			let deploymentMeta = connectedClients[serverTag].deploymentMeta;

			for (let i = 0; i < deploymentMeta.length; i++) {
				let appMeta = deploymentMeta[i];

				if (appMeta.deploymentName === incomingAppMeta.deploymentName) {
					deploymentMeta[i] = incomingAppMeta;
					this.emitWebClientUpdateAvailable();
					incomingAppMeta.serverTag = serverTag;
					this.emitWebClientEvent(Event.APPLICATION_UPDATED, incomingAppMeta);
					break;
				}
			}
		});
	}

	emitWebClientUpdateAvailable() {
		logger.debug(`emiting 'client-update-available' to ${WEB_CLIENT_ROOM_NAME}`);
		this.socket.to(WEB_CLIENT_ROOM_NAME).emit('client-update-available');
	}

	emitWebClientEvent(eventName, data) {
		logger.debug(`emiting '${eventName}' to ${WEB_CLIENT_ROOM_NAME}`);
		this.socket.to(WEB_CLIENT_ROOM_NAME).emit(eventName, data);
	}

	broadcastMessage(event, data) {
		this.socket.emit(event, data);
	}

	getConnectedServers(band) {
		let connections = [];

		logger.debug(`get connected servers for band@${band}`);

		for (let serverTag in connectedClients) {
			let {band: serverBand, deploymentMeta} = connectedClients[serverTag];
			logger.debug(`get connected server ${serverTag}@${serverBand}`);
			if (serverBand !== band) {
				continue;
			}
			connections.push({
				tag: serverTag,
				band: serverBand,
				deploymentMeta
			})
		}

		return connections;
	}

	/**
	 * @param {String?} band
	 */
	getServerDeploymentMeta(band) {
		const deploymentEntries = [];

		for (let serverTag in connectedClients) {
			let serverDeployments = connectedClients[serverTag].deploymentMeta;
			let serverBand = connectedClients[serverTag].band;

			if (band && serverBand !== band) {
				continue;
			}

			serverDeployments = JSON.parse(JSON.stringify(serverDeployments));

			serverDeployments.forEach(deployment => {
				deployment.band = serverBand;
				deployment.serverTag = serverTag;
				deployment.updateMeta = deployment.updateMeta || {};
			});

			deploymentEntries.push.apply(deploymentEntries, serverDeployments);
		}

		return deploymentEntries;
	}

	/**
	 * @param {Object} query
	 * @param {String[]} query.serverTags
	 * @param {String} query.deploymentName
	 * @param {String} query.band
	 * @param {Object} update
	 * @param {String} update.version
	 */
	updateServerMeta({serverTags, deploymentName, band}, update) {
		for (let i = 0; i < serverTags.length; i++) {
			let serverTag = serverTags[i];

			let client = connectedClients[serverTag];

			if (!client || client.band !== band) {
				continue;
			}

			let deployment = client.deploymentMeta.find(deployment => deployment.deploymentName === deploymentName);

			if (!deployment) {
				continue;
			}

			Object.assign(deployment, {updateMeta: update});
		}

		this.emitWebClientUpdateAvailable();
	}
}

module.exports = new EventHandler();