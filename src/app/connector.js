import events from 'events';
import jackrabbit from 'jackrabbit';
import mongoose from 'mongoose';

import logger from '../modules/logger';

class Connector extends events.EventEmitter {
	constructor(urls) {
		super();
		this.count = 2;
		this.urls = urls || {};

		this.db = this.mongoose();
		this.queue = this.jackrabbit();
	}


	// 'Private' methods.

	_ready() {
		// Connection ready!
		if (--this.count) {
			this.emit('ready');
		}
	}

	_lost() {
		// Connection lost!
		this.emit('lost');
	}

	// 'Public' methods.

	mongoose() {
		let self = this;

		return mongoose.connect(this.urls.mongoose)
		.on('connected', () => {  
			logger.log('info', 'Connector: Mongoose connected.');
			self._ready();
		})
		.on('error', err => {
			logger.log('error', err);
		})
		.on('disconnected', () => {
			logger.log('info', 'Connector: Mongoose disconnected.');
		})
	}

	jackrabbit() {
		let self = this;

		return jackrabbit(this.urls.jackrabbit)
		.on('connected', () => {
			logger.log('info', 'Connector: Jackrabbit connected.');
			self._ready();
		})
		.on('error', err => {
			logger.log('error', err);
		})
		.on('disconnected', () => {
			logger.log('info', 'Connector: Jackrabbit disconnected.');
			self._lost();
		});
	}

}

export default function(urls) {
	return new Connector(urls);
}