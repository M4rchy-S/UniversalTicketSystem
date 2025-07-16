const express = require('express');
const {Server} = require("socket.io");
const {createServer} = require("node:http");

const sessionMiddleware  = require('./config/session-config');
const corsSettings = require('./config/cors-config');
const WebSocketTicketChat = require('./controllers/TicketChatController');

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

WebSocketTicketChat(io);

const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 4000;
io.listen(WEBSOCKET_PORT);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});