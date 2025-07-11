const express = require('express');
const routes = require('./routes');
const logger = require('./middlewares/logger');
const session = require("express-session")
const cors = require("cors");
const { cookie } = require('express-validator');
const { http } = require('winston');

const app = express();

app.use(cors({
  // origin: "http://localhost:5173",
  origin: "*",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "secret_secret",
  resave: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send('Something broke!');
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});