'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({
	eventID: String,
	type: String,
	timestamp: Number
});

var Event = _mongoose2.default.model('Event', schema);

exports.default = Event;
//# sourceMappingURL=EventModel.js.map