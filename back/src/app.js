const express = require('express');
const {Server} = require("socket.io");
const {createServer} = require("node:http");

const sessionMiddleware  = require('./config/session-config');
const corsSettings = require('./config/cors-config');

const logger = require('./middlewares/logger');
const routes = require('./routes');

const cors = require("cors");

const app = express();
const httpServer = createServer(app);

app.use(cors(corsSettings));

app.use(express.json());

app.use(sessionMiddleware);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send('Something broke!');
});

app.use('/api', routes);

const io = new Server(httpServer, {
  cors: corsSettings
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.on("connection", (socket) => {
  
  const session = socket.request.session;

  console.log("[+] Websocket user connected");
  console.log(session);
  
  socket.on('message', ({msg}) => {

    if(session.email)
      console.log(`Email : ${session.email}`);

    io.emit('message', {msg: msg});

  });

  socket.on('disconnect', () => {
    console.log("[-] User diconected");
  });

});

io.listen(4000);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});