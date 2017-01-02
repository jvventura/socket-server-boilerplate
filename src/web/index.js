import http from 'http';

import express from 'express';
import socketio from 'socket.io';
import sharedSession from 'express-socket.io-session';

import sessions from '../modules/sessions';

function Web(app) {
	// Instantiate server.
	let web = express();
	let server = http.createServer(web);
	let io = socketio(server);

	// Connect to RedisStore for sessions.
	let session = sessions(process.env.REDISCLOUD_URL);
	web.use(session);
	web.use(cookieParser());
	io.use(sharedsession(session, {
	    autoSave:true
	}));

	io.on('connection', socket => {
		/*
		// user data scheme:
			// user id, 'infinite' duration
			// session id, session duration
		socket.on('connect', () => {
			if (!socket.handshake.session) {
				Function.compose(checkUser, checkSession); // dunno if this will work
				// if no user id supplied, generate a new one
				// if no session is supplied, generate a new one
			}
		});

		socket.on('message', data => {
			// double check user and session!
			// validate message
			// call App.queueData
		});


		function checkUser() {}
		function checkSession() {}
		*/

		socket.on('connect', () => {
			app.queue({test:1});
		});
	});

	// Start server.
	let port = process.env.PORT || 5000;
	server.listen(port, () => {
		logger.log('info', 'Server listening on port %port', server.address().port);
	});

	return server;
}

export default Web;
