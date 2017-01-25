Purpose
=======
For handling web socket connections with persistent user session.

Handle socket connections with socket.io

Handle HTTP router requests with express.

Handle user session data with express-session middleware via Redis.

Handle web-worker job queue with AMQP via rabbitmq.

Handle mongodb connection via mongoose.

Use
===
Install dependencies:
```
npm install
npm install foreman -G
```

Build: (should be pre-built)
```
npm run build
```

Start services: (must install with brew first)
```
brew services start redis
brew services start mongo
brew services start rabbitmq
```

Start node-foreman:
```
npm start
```

Open browser to <http://localhost:5000/test>.

Watch the session cookie set and the events roll in. The worker should be logging:
```
App: db processed event.
```