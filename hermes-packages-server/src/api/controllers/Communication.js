const request = require('request-promise');
const {authToken, channelId} = require('../lib/config').slack;

module.exports = {
	emitMessage: async (req, res, next) => {
		let {title, body} = req.swagger.params.message.value;

		try {
			await request.post({
				uri: 'https://slack.com/api/chat.postMessage',
				headers: {
					authorization: `Bearer ${authToken}`
				},
				json: {
					channel: channelId,
					text: title ? `*${title}*\n${body}` : body
				}
			})

			res.sendData();
		} catch(err) {
			res.sendData(err);
		}
	}
};