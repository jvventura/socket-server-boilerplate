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

exports.default = function (urls) {
	return new Connector(urls);
};

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _jackrabbit2 = require('jackrabbit');

var _jackrabbit3 = _interopRequireDefault(_jackrabbit2);

var _mongoose2 = require('mongoose');

var _mongoose3 = _interopRequireDefault(_mongoose2);

var _logger = require('../modules/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Connector = function (_events$EventEmitter) {
	(0, _inherits3.default)(Connector, _events$EventEmitter);

	function Connector(urls) {
		(0, _classCallCheck3.default)(this, Connector);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Connector.__proto__ || (0, _getPrototypeOf2.default)(Connector)).call(this));

		_this.count = 2;
		_this.urls = urls || {};

		_this.db = _this.mongoose();
		_this.queue = _this.jackrabbit();
		return _this;
	}

	// 'Private' methods.

	(0, _createClass3.default)(Connector, [{
		key: '_ready',
		value: function _ready() {
			// Connection ready!
			if (--this.count == 0) {
				this.emit('ready');
			}
		}
	}, {
		key: '_lost',
		value: function _lost() {
			// Connection lost!
			this.emit('lost');
		}

		// 'Public' methods.

	}, {
		key: 'mongoose',
		value: function mongoose() {
			var self = this;

			_mongoose3.default.connect(this.urls.mongoose);

			_mongoose3.default.connection.on('connected', function () {
				_logger2.default.log('info', 'Connector: Mongoose connected.');
				self._ready();
			});
			_mongoose3.default.connection.on('error', function (err) {
				_logger2.default.log('error', err);
			});
			_mongoose3.default.connection.on('disconnected', function () {
				_logger2.default.log('info', 'Connector: Mongoose disconnected.');
			});
		}
	}, {
		key: 'jackrabbit',
		value: function jackrabbit() {
			var self = this;

			var rabbit = (0, _jackrabbit3.default)(this.urls.jackrabbit);
			rabbit.on('connected', function () {
				_logger2.default.log('info', 'Connector: Jackrabbit connected.');
				self._ready();
			});
			rabbit.on('error', function (err) {
				_logger2.default.log('error', err);
			});
			rabbit.on('disconnected', function () {
				_logger2.default.log('info', 'Connector: Jackrabbit disconnected.');
				self._lost();
			});
			return rabbit.default();
		}
	}]);
	return Connector;
}(_events2.default.EventEmitter);
//# sourceMappingURL=connector.js.map