var sess = {
    secret: "ascit-study-supports-session",
    cookie: { secure: true, maxAge: 60000},
    saveUninitialized: false,
    resave: false
  };

module.exports = sess;