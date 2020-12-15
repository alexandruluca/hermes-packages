const io = require('../../lib/io');

class GlobalEventBusService {
	constructor() {
		this.broadcastedEventData = {};
	}
	emitDeploymentStatusUpdate(eventName, {data = null, isCompleted = false, failure = false} = {}) {
		if (data) {
			this.broadcastedEventData[eventName] = data;
		}
		data = data || this.broadcastedEventData[eventName];

		if (isCompleted) {
			delete this.broadcastedEventData[eventName];
		}

		return io.broadcastMessage('deployment-status-update', {
			eventName,
			data,
			action: failure ? 'failure' : (isCompleted ? 'end' : 'start'),
			issueNumber: this.issueNumber,
			targetBranch: this.targetBranch,
			sourceBranch: this.sourceBranch,
			pullId: this.pullId
		});
	}
}

exports.globalEventBusService = new GlobalEventBusService();