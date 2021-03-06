import events from 'events';

import connections from './connector';
import logger from '../modules/logger';

import config from '../config';

import Event from './EventModel';

class App extends events.EventEmitter {
	constructor() {
		super();

		this.connections = connections({
			jackrabbit: config.connections.amqp,
			mongoose: config.connections.mongo
		});

		this.connections.on('ready', this._onConnected.bind(this));

		this.rabbit = {};
		this.db;
	}

	// 'Private' methods.

	_onConnected() {

		// Setup jackrabbit queues.
		this.rabbit.events = this.connections.queue.queue({
			name: 'jobs.event',
			prefetch: 5,
			durabe: true
		});

		this.rabbit.db = this.connections.queue.queue({
			name: 'jobs.db',
			prefetch: 5,
			durabe: true
		});

		// Reference mongoose connection.
		this.db = this.connections.db;


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
		let self = this;

		this.rabbit.events.consume((job, ack) => {
			let eventName = job.type || 'unclassified';
			let count = 2;

			// Publish any "sub-jobs".
			this.connections.queue.publish(job, {key: 'jobs.db'});

			ack();
		});

		this.rabbit.db.consume((job, ack) => {
			let event = new Event(job);
			event.save(err => {
				if (err) {
					logger.log('warn', 'App: db error.', err);
					return;
				} else {
					logger.log('info', 'App: db processed event.', job);
					ack();
				}
			});
		});
	}
}

export default function() {
	return new App();
}