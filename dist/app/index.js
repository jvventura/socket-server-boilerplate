'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = function () {
	return new App();
};

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _logger = require('../modules/logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _EventModel = require('./EventModel');

var _EventModel2 = _interopRequireDefault(_EventModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function (_events$EventEmitter) {
	(0, _inherits3.default)(App, _events$EventEmitter);

	function App() {
		(0, _classCallCheck3.default)(this, App);

		var _this = (0, _possibleConstructorReturn3.default)(this, (App.__proto__ || (0, _getPrototypeOf2.default)(App)).call(this));

		_this.connections = (0, _connector2.default)({
			jackrabbit: _config2.default.connections.amqp,
			mongoose: _config2.default.connections.mongo
		});

		_this.connections.on('ready', _this._onConnected.bind(_this));

		_this.rabbit = {};
		_this.db;
		return _this;
	}

	// 'Private' methods.

	(0, _createClass3.default)(App, [{
		key: '_onConnected',
		value: function _onConnected() {

			// Setup jackrabbit queues.
			this.rabbit.events = this.connections.queue.queue({
				name: 'jobs.event',
				prefetch: 5,
				durabe: true
			});

			this.rabbit.db = this.connections.queue.queue({
				name: 'jobs.db',
				prefetch: 5,
				durabe: true
			});

			// Reference mongoose connection.
			this.db = this.connections.db;

			this._onReady();
		}
	}, {
		key: '_onReady',
		value: function _onReady() {
			this.emit('ready');
			_logger2.default.log('info', 'App: Ready!');
		}
	}, {
		key: '_onLost',
		value: function _onLost() {
			this.emit('lost');
			_logger2.default.log('info', 'App: Disconnected.');
		}

		// 'Public' methods.
		// process event (pass msg data to queue for worker)

	}, {
		key: 'queue',
		value: function queue(data) {
			this.connections.queue.publish(data, { key: 'jobs.event' });
		}
	}, {
		key: 'process',
		value: function process() {
			var _this2 = this;

			var self = this;

			this.rabbit.events.consume(function (job, ack) {
				var eventName = job.type || 'unclassified';
				var count = 2;

				// Publish any "sub-jobs".
				_this2.connections.queue.publish(job, { key: 'jobs.db' });

				ack();
			});

			this.rabbit.db.consume(function (job, ack) {
				var event = new _EventModel2.default(job);
				event.save(function (err) {
					if (err) {
						_logger2.default.log('warn', 'App: db error.', err);
						return;
					} else {
						_logger2.default.log('info', 'App: db processed event.', job);
						ack();
					}
				});
			});
		}
	}]);
	return App;
}(_events2.default.EventEmitter);
//# sourceMappingURL=index.js.map