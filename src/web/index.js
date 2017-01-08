import http from 'http';

import express from 'express';
import socketio from 'socket.io';
import cookieParser from 'cookie-parser';
import uuidv4 from 'uuid/v4';

import sessions from '../modules/sessions';
import logger from '../modules/logger';

import config from '../config';

function Web(app) {
	// Instantiate server.
	let web = express();
	let server = http.createServer(web);
	let io = socketio(server);

	// Connect to RedisStore for sessions.
	let session = sessions(config.connections.redis);
	web.use(session);
	web.use(cookieParser());

	io.use(function(socket, next) {
    	session(socket.handshake, {}, next);
	});

	io.on('connection', socket => {

		socket.on('hello', msg => {
			logger.log('info', 'hello, msg:', msg);
			uuidFlow(msg);
		});


		socket.on('event', msg => {
			logger.log('info', 'event, msg:', msg);

			if (!msg.uuid) {
				logger.log('info', 'msg.uuid not specified.');
				if (!!socket.handshake.session.uuid) {
					msg.uuid = socket.handshake.session.uuid;
					logger.log('info', 'session.uuid used in lieu of msg.uuid.', socket.handshake.session.uuid);
				} else {
					logger.log('info', );
					uuidFlow(msg);
					msg.uuid = socket.handshake.session.uuid;
					logger.log('info', 'No session.uuid to use in lieu of msg.uuid. Passed to uuidFlow first to set session.uuid.');
				}
			}

			let data = msg.data || {};
				data.eventID = uuidv4();
			app.queue(data);

		});

		function uuidFlow(msg) {
			// Reconcile uuid ad supply one if necessary.
			// msg.uuid is supplied by the client, and is stored in the 1st party cookie.
			// session.uuid is supplied by the client, via the HTTP cookie header, and is stored in the 3rd party cookie.
				// session.uuid acts as a back-up, in case 1st party cookie is deleted.
				// If the browser has 3rd party cookies disabled, then nothing should really happen because Express will attempt to set it, but it will not work.
			
			// If msg.uuid exists...
			if (!!msg.uuid) {
				
				// ... and session.uuid exists...
				if (!!socket.handshake.session.uuid) {

					// ... compare them...
					let check = msg.uuid == socket.handshake.session.uuid;
					if (!!check) {
						logger.log('info', 'T|T|T : Do nothing.', socket.handshake.session.uuid, msg.uuid);
					} else {
						logger.log('info', 'T|F : Respond with session.uuid.', socket.handshake.session.uuid, msg.uuid);
					}

				// ... and session.uuid does not exist...
				} else {
					logger.log('info', 'T|F : Set session.uuid to msg.uuid.', socket.handshake.session.uuid, msg.uuid);
					socket.handshake.session.uuid = msg.uuid;
				}

			// If msg.uuid does not exist...
			} else {

				// ... and session.uuid exists...
				if (!!socket.handshake.session.uuid) {
					socket.emit('hello', {uuid: socket.handshake.session.uuid});
					logger.log('info', 'F|T : Respond with session.uuid.', socket.handshake.session.uuid, msg.uuid);

				// ... and session.uuid does not exist...
				} else {
					let uuid = uuidv4();
					socket.handshake.session.uuid = uuid;
					socket.emit('hello', {uuid: socket.handshake.session.uuid})
					logger.log('info', 'F|T : Respond with newly generated uuid. Set session.uuid.', socket.handshake.session.uuid, msg.uuid);
				}

			}			
		}

	});

	web.get('/test', (req, res) => {
		res.sendFile('test.html', { root: __dirname });
	});

	// Start server.
	let port = process.env.PORT || 5000;
	server.listen(port, () => {
		logger.log('info', 'Server listening on port', server.address().port);
	});

	return server;
}

export default Web;
