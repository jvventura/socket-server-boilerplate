import events from 'events';

import connections from './connector';
import logger from '../modules/logger';

class App extends events.EventEmitter {
	constructor() {
		super();

		this.connections = connections({
			jackrabbit: process.env.CLOUDAMQP_URL || 'amqp://localhost',
			mongoose: process.env.MONGODB_URI || 'mongodb://localhost:27017'
		});

		this.connections.on('ready', this._onConnected.bind(this));

		this.rabbit;
	}

	// 'Private' methods.

	_onConnected() {
		/*
		this.Events = this.connections.db; // instantiate schema (or connection to whatever db);
		*/

		this.rabbit = this.connections.queue.queue({
			name: 'jobs.event',
			prefetch: 5,
			durabe: true
		});

		this._onReady();
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
		this.connections.queue.publish(data, {key: 'jobs.event'});
	}

	process() {
		this.rabbit.consume((job, ack) => {
			logger.log('info', job);
			ack();
		});
	}
}

export default function() {
	return new App();
}