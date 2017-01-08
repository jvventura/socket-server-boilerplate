var expSession = require('express-session');
var RedisStore = require('connect-redis')(expSession);

module.exports = function Sessions(url) {
	var store = new RedisStore({url:url});
	var session = expSession({
		secret: process.env.EXPRESS_SESSION_SECRET || 'test',
		store: store,
		resave: true,
		saveUninitialized: true,
		cookie: {
			domain: !process.env.ENV ? 'localhost' : '.joi-analytics.com',
			expires: new Date(2147483647000)
		}
	});

	return session;
}