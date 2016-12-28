import http from 'http';
import express from 'express';
import socketio from 'socket.io';

import sessions from './modules/sessions';
import sharedSession from 'express-socket.io-session';

// Instantiate server.
let web = express();
let server = http.createServer(web);
let io = socketio(server);

// Connect to RedisStore for sessions.
let session = sessions(process.env.REDISCLOUD_URL);
web.use(session);
web.use(cookieParser());
io.use(sharedsession(session, {
    autoSave:true
}));

// Start server.
let port = process.env.PORT || 5000;
server.listen(port);