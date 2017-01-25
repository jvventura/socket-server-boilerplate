'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	connections: {
		amqp: process.env.CLOUDAMQP_URL || 'amqp://localhost',
		mongo: process.env.MONGODB_URI || 'mongodb://localhost:27017',
		redis: process.env.REDISCLOUD_URL || 'redis://localhost'
	},
	env: process.env.ENV || 'local'
};
//# sourceMappingURL=config.js.map