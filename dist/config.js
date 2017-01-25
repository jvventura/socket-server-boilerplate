'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	connections: {
		amqp: process.env.CLOUDAMQP_URL || 'amqp://localhost',
		mongo: process.env.MONGODB_URI || 'mongodb://localhost:27017',
		redis: process.env.REDISCLOUD_URL || 'redis://localhost',
		keen: {
			projectId: process.env.KEEN_ID,
			writeKey: process.env.KEEN_KEY
		},
		aws: {
			key: process.env.AWS_ACCESS_KEY_ID,
			secret: process.env.AWS_SECRET_ACCESS_KEY
		}
	},
	env: process.env.ENV || 'local'
};
//# sourceMappingURL=config.js.map