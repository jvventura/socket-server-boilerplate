import events from 'events';
import jackrabbit from 'jackrabbit';
import logger from '../modules/logger';

class Connector extends events.EventEmitter {
	constructor(urls) {
		super();
		this.count = 2;
		this.urls = urls || {};
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

	db() {
		_ready();
		return; // connect to some db to hold events (cassandra?)
	}

	queue() {
		return jackrabbit(this.urls.jackrabbit)
		.on('connected', function() {
			logger.log('info', 'Connector: Jackrabbit connected.');
			_ready();
		})
		.on('error', function(err) {
			logger.log('error', err);
		})
		.on('disconnected', function() {
			logger.log('info', 'Connector: Jackrabbit disconnected.');
			_lost();
		});
	}

}

export default function(urls) {
	return new Connector(urls);
}