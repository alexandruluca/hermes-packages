const request = require('request-promise');
const {authToken, channelId} = require('../lib/config').slack;

module.exports = {
	emitMessage: async (req, res, next) => {
		let {title, body, type, subTitle} = req.swagger.params.message.value;

		let attachmentColor = '#99ccff';

		if (type === 'success') {
			attachmentColor = '#36a64f';
		} else if (type === 'error') {
			attachmentColor = 'danger';
		}

		try {
			await request.post({
				uri: 'https://slack.com/api/chat.postMessage',
				headers: {
					authorization: `Bearer ${authToken}`
				},
				json: {
					channel: channelId,
					text: title,
					attachments: [{
						author_name: subTitle,
						color: attachmentColor,
						text: body
					}]
				}
			})
			res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	}
};