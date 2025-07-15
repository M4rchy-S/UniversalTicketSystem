const session = require("express-session")

const sessionMiddleware = session({
    secret: "secret_secret",
    resave: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "strict"
    },
    saveUninitialized: true
  });


module.exports = sessionMiddleware ;