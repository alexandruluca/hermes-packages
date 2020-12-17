module.exports = {
	handleGithubHook: (req, res, next) => {
		let event = req.headers['x-github-event'];
		let hookPayload = req.swagger.params.hookPayload.value;

		let action = hookPayload.action;

		console.log(event + ':' + action);

		res.sendData();
	}
};