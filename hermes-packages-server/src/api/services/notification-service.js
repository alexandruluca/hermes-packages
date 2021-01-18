const request = require('request-promise');
const {authToken, channelId} = require('../lib/config').slack;

/**
 * @param {Object} payload
 * @param {String} payload.title
 * @param {String} payload.body
 * @param {'success' | 'error'} payload.type
 * @param {String} payload.subTitle
 */
exports.emitMessage = async function (payload) {
	let {title, body, type, subTitle} = payload;

	type = type || 'success';

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
	} catch (err) {
		console.log(err);
	}
}