io.on('connection', socket => {

	// user data scheme:
		// user id, 'infinite' duration
		// session id, session duration
	socket.on('connect', () => {
		if (!socket.handshake.session) {
			Function.compose(checkUser, checkSession); // dunno if this will work
			// if no user id supplied, generate a new one
			// if no session is supplied, generate a new one
		}
	});

	socket.on('message', data => {
		// double check user and session!
		// validate message
		// call App.queueData
	});


	function checkUser() {}
	function checkSession() {}
});