import events from 'events';

import connections from './connector';
import logger from '../modules/logger';

class App extends events.EventEmitter {
	constructor() {
		super();

		this.connections = connections({
			jackrabbit: process.env.CLOUDAMQP_URL,
			mongoose: process.env.MONGODB_URI
		});

		this.connections.on('ready', this._onConnected);
	}

	// 'Private' methods.

	_onConnected() {
		this.Events = this.connections.db; // instantiate schema (or connection to whatever db);
		this.connections.queue.create(this._onReady); // create the queue then emit ready event
	}

	_onReady() {
		this.emit('ready');
		logger.log('info', 'App: Ready!')
	}

	_onLost() {
		this.emit('lost');
		logger.log('info', 'App: Disconnected.');
	}

	// 'Public' methods.
		// process event (pass msg data to queue for worker)

	queue(data) {
		this.connections.queue.publish('jobs.event', data);
	}

	process() {
		this.connections.handle('jobs.event', (job, ack) => {
			logger.log('info', job);
		});
	}
}

export default function() {
	return new App();
}