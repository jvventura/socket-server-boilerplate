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

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _sessions = require('../modules/sessions');

var _sessions2 = _interopRequireDefault(_sessions);

var _logger = require('../modules/logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Web(app) {
	// Instantiate server.
	var web = (0, _express2.default)();
	var server = _http2.default.createServer(web);
	var io = (0, _socket2.default)(server);

	// Connect to RedisStore for sessions.
	var session = (0, _sessions2.default)(_config2.default.connections.redis);
	web.use(session);
	web.use((0, _cookieParser2.default)());

	io.use(function (socket, next) {
		session(socket.handshake, {}, next);
	});

	io.on('connection', function (socket) {

		socket.on('hello', function (msg) {
			_logger2.default.log('info', 'hello, msg:', msg);
			uuidFlow(msg);
		});

		socket.on('event', function (msg) {
			_logger2.default.log('info', 'event, msg:', msg);

			if (!msg.uuid) {
				_logger2.default.log('info', 'msg.uuid not specified.');
				if (!!socket.handshake.session.uuid) {
					msg.uuid = socket.handshake.session.uuid;
					_logger2.default.log('info', 'session.uuid used in lieu of msg.uuid.', socket.handshake.session.uuid);
				} else {
					_logger2.default.log('info');
					uuidFlow(msg);
					msg.uuid = socket.handshake.session.uuid;
					_logger2.default.log('info', 'No session.uuid to use in lieu of msg.uuid. Passed to uuidFlow first to set session.uuid.');
				}
			}

			var data = msg.data || {};
			data.eventID = (0, _v2.default)();
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
					var check = msg.uuid == socket.handshake.session.uuid;
					if (!!check) {
						_logger2.default.log('info', 'T|T|T : Do nothing.', socket.handshake.session.uuid, msg.uuid);
					} else {
						_logger2.default.log('info', 'T|F : Respond with session.uuid.', socket.handshake.session.uuid, msg.uuid);
					}

					// ... and session.uuid does not exist...
				} else {
					_logger2.default.log('info', 'T|F : Set session.uuid to msg.uuid.', socket.handshake.session.uuid, msg.uuid);
					socket.handshake.session.uuid = msg.uuid;
				}

				// If msg.uuid does not exist...
			} else {

				// ... and session.uuid exists...
				if (!!socket.handshake.session.uuid) {
					socket.emit('hello', { uuid: socket.handshake.session.uuid });
					_logger2.default.log('info', 'F|T : Respond with session.uuid.', socket.handshake.session.uuid, msg.uuid);

					// ... and session.uuid does not exist...
				} else {
					var uuid = (0, _v2.default)();
					socket.handshake.session.uuid = uuid;
					socket.emit('hello', { uuid: socket.handshake.session.uuid });
					_logger2.default.log('info', 'F|T : Respond with newly generated uuid. Set session.uuid.', socket.handshake.session.uuid, msg.uuid);
				}
			}
		}
	});

	web.get('/test', function (req, res) {
		res.sendFile('test.html', { root: __dirname });
	});

	// Start server.
	var port = process.env.PORT || 5000;
	server.listen(port, function () {
		_logger2.default.log('info', 'Server listening on port', server.address().port);
	});

	return server;
}

exports.default = Web;
//# sourceMappingURL=index.js.map