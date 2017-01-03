import http from 'http';
import throng from 'throng';

import App from './app';
import Web from './web';

import logger from './modules/logger';

http.globalAgent.maxSockets = Infinity;
throng({ workers: 1 }, start);

function start() {
	logger.log('info', 'Attempting to starting server.');

	let instance = App();

	instance.on('ready', createServer);
	instance.on('lost', abort);

	function createServer() {
		// If THRIFTY mode, process will act as both publisher and consumer.
		if (process.env.THRIFTY) instance.process();

		let server = Web(instance);
		process.on('SIGTERM', shutdown);
		instance
		.removeListener('lost', abort)
		.on('lost', shutdown);

		function shutdown() {
			logger.log('info', 'Server shutting down.');
			server.close(function() {
				logger.log('info', 'Server shutdown.');
				process.exit();
			});
		}
	}

	function abort() {
		logger.log('info', 'Server abort.');
		process.exit();
	}
}