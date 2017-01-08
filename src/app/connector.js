import events from 'events';
import jackrabbit from 'jackrabbit';
import mongoose from 'mongoose';
import KeenIO from 'keen-tracking';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import logger from '../modules/logger';

class Connector extends events.EventEmitter {
	constructor(urls) {
		super();
		this.count = 3;
		this.urls = urls || {};

		this.db = this.dynamoDB();
		this.queue = this.jackrabbit();
		this.tracker = this.keen();
	}


	// 'Private' methods.

	_ready() {
		// Connection ready!
		if (--this.count == 0) {
			this.emit('ready');
		}
	}

	_lost() {
		// Connection lost!
		this.emit('lost');
	}

	// 'Public' methods.

	dynamoDB() {
		let self = this;

		let client = new DynamoDB();
			client.doc = new DynamoDB.DocumentClient({region: 'us-west-2'});
		logger.log('info', 'Connector: DynamoDB connected.');
		self._ready();
		return client;
	}

/*
	mongoose() {
		let self = this;

		mongoose.connect(this.urls.mongoose);

		mongoose.connection.on('connected', () => {  
			logger.log('info', 'Connector: Mongoose connected.');
			self._ready();
		});
		mongoose.connection.on('error', err => {
			logger.log('error', err);
		});
		mongoose.connection.on('disconnected', () => {
			logger.log('info', 'Connector: Mongoose disconnected.');
		});
	}
*/ 

	jackrabbit() {
		let self = this;

		let rabbit = jackrabbit(this.urls.jackrabbit);
		rabbit.on('connected', () => {
			logger.log('info', 'Connector: Jackrabbit connected.');
			self._ready();
		})
		rabbit.on('error', err => {
			logger.log('error', err);
		})
		rabbit.on('disconnected', () => {
			logger.log('info', 'Connector: Jackrabbit disconnected.');
			self._lost();
		});
		return rabbit.default();
	}

	keen() {
		let self = this;

		let client = new KeenIO(this.urls.keen);
		logger.log('info', 'Connector: Keen connected.');
		self._ready();
		return client;
	}

}

export default function(urls) {
	return new Connector(urls);
}