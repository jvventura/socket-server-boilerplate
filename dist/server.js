'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _throng = require('throng');

var _throng2 = _interopRequireDefault(_throng);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _web = require('./web');

var _web2 = _interopRequireDefault(_web);

var _logger = require('./modules/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_http2.default.globalAgent.maxSockets = Infinity;
(0, _throng2.default)(start);

function start() {
	_logger2.default.log('info', 'Starting server.');

	var instance = (0, _app2.default)();

	instance.on('ready', createServer);
	instance.on('lost', abort);

	function createServer() {
		var server = (0, _web2.default)(instance);
		process.on('SIGTERM', shutdown);
		instance.removeListener('lost', abort).on('lost', shutdown);

		function shutdown() {
			_logger2.default.log('info', 'Server shutting down.');
			server.close(function () {
				_logger2.default.log('info', 'Server shutdown.');
				process.exit();
			});
		}
	}

	function abort() {
		_logger2.default.log('info', 'Server abort.');
		process.exit();
	}
}
//# sourceMappingURL=server.js.map