import events from 'events';

import connections from './connections';

class App extends events.EventEmitter {
	constructor() {
		super();

		this.connections = connections({
			jackrabbit: process.env.CLOUDAMQP_URL
		});

		this.connections.on('ready', this._onConnected);

	}

	// 'Private' methods.

	_onConnected() {

	}

	_onReady() {

	}

	_onLost() {

	}

	// 'Public' methods.
		// process event (pass msg data to queue for worker)
}