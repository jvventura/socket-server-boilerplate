Purpose
=======
For handling web socket connections with persistent user session.

Use
===
Install dependencies:
```
npm install
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

Open browser to [http://localhost:5000/test].

Watch the session cookie set and the events roll in. The worker should be logging:
```
App: db processed event.
```