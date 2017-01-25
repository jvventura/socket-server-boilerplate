import http from 'http';
import throng from 'throng';

import App from './app';
import logger from './modules/logger';

http.globalAgent.maxSockets = Infinity;
throng(start);

function start() {
	logger.log('info', 'Starting worker.');

	let instance = App();

	instance.on('ready', doWork);
	process.on('SIGTERM', shutdown);

	function doWork() {
		instance.process();
	}
	function shutdown() {
		logger.log('info', 'Worker shutting down.');
		process.exit();
	}
}