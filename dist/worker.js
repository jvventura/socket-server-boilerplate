'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _throng = require('throng');

var _throng2 = _interopRequireDefault(_throng);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _logger = require('./modules/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_http2.default.globalAgent.maxSockets = Infinity;
(0, _throng2.default)(start);

function start() {
	_logger2.default.log('info', 'Starting worker.');

	var instance = (0, _app2.default)();

	instance.on('ready', doWork);
	process.on('SIGTERM', shutdown);

	function doWork() {
		instance.process();
	}
	function shutdown() {
		_logger2.default.log('info', 'Worker shutting down.');
		process.exit();
	}
}
//# sourceMappingURL=worker.js.map