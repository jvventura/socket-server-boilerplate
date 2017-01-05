import http from 'http';

import express from 'express';
import socketio from 'socket.io';
import cookieParser from 'cookie-parser';

import sessions from '../modules/sessions';
import logger from '../modules/logger';

function Web(app) {
	// Instantiate server.
	let web = express();
	let server = http.createServer(web);
	let io = socketio(server);

	// Connect to RedisStore for sessions.
	let session = sessions(process.env.REDISCLOUD_URL);
	web.use(session);
	web.use(cookieParser());

	io.use(function(socket, next) {
    	session(socket.request, socket.request.res, next);
	});

	io.on('connection', socket => {
		if (!socket.request.session.socket) {
			logger.log('info', 'No socket session data, setting test prop.');
			socket.request.session.socket = {
				test: 1
			};
		}

		logger.log('info', socket.request.session);
		logger.log('info', socket.request.session.socket);
		/*
		// user data scheme:
			// user id, 'infinite' duration
			// session id, session duration
		socket.on('connect', () => {

		});

		socket.on('message', data => {
			// double check user and session!
			// validate message
			// call App.queueData
		});


		function checkUser() {}
		function checkSession() {}
		*/
		//app.queue({event: 'socket_connection'});

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
