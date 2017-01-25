var expSession = require('express-session');
var RedisStore = require('connect-redis')(expSession);

module.exports = function Sessions(url) {
	var store = new RedisStore({url:url});
	var session = expSession({
		secret: process.env.EXPRESS_SESSION_SECRET,
		store: store,
		resave: true,
		saveUninitialized: true,
		cookie: {domain: '.joi-analytics.com'}
	});

	return session;
}