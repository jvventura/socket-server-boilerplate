'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _expressSocket = require('express-socket.io-session');

var _expressSocket2 = _interopRequireDefault(_expressSocket);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _sessions = require('../modules/sessions');

var _sessions2 = _interopRequireDefault(_sessions);

var _logger = require('../modules/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Web(app) {
	// Instantiate server.
	var web = (0, _express2.default)();
	var server = _http2.default.createServer(web);
	var io = (0, _socket2.default)(server);

	// Connect to RedisStore for sessions.
	var session = (0, _sessions2.default)(process.env.REDISCLOUD_URL);
	web.use(session);
	web.use((0, _cookieParser2.default)());
	io.use((0, _expressSocket2.default)(session, {
		autoSave: true
	}));

	io.on('connection', function (socket) {
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
		app.queue({ event: 'socket_connection' });
	});

	setInterval(function () {
		app.queue({ event: 'interval' });
	}, 5000);

	// Start server.
	var port = process.env.PORT || 5000;
	server.listen(port, function () {
		_logger2.default.log('info', 'Server listening on port', server.address().port);
	});

	return server;
}

exports.default = Web;
//# sourceMappingURL=index.js.map