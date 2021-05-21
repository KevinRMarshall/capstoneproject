//allows use of .env varaibles
require('dotenv').config();
const express = require("express");

//session for testing; use database for production (Dylan will change this later)
var session = require('express-session');
var sess = require('./session');
var UUID = require('uuid');

//for parsing requests sent to server
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');

const SERVER_PORT = process.env.PORT || 3000;

//routes
var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');
var forumRouter = require('./routes/forum');
var reportRouter = require('./routes/report');
var eventRouter = require('./routes/event');
var schoolEventRouter = require('./routes/schoolEvents');
var feedRouter = require('./routes/feed');
var alertRouter = require('./routes/alert');

// Create Express App and Routes
const app = express();

app.locals.displayName = '';
app.locals.userId = '';

app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

app.use(session(sess));

//local vars for template layout
//app.use('/auth', function(req, res, next) {
  // console.log("entered the place");
  // res.redirect('http://localhost:8080/#/login');
  // //if there is a user logged in then send to page and load into response locals
  // if(req.session.userId) {
  //     console.log('entered if');
  //     res.locals.displayName = app.locals.displayName;
  //     console.log('in app: the req.session.userId is: ' + req.session.userId);
  //     next();
  // }

  // return res.redirect('http://localhost:8080/#/');
//   next();
// });

app.use ('/profile', profileRouter);
app.use('/auth', authRouter);
app.use('/forum', forumRouter);
app.use('/report', reportRouter);
app.use('/event', eventRouter);
app.use('/schoolevents', schoolEventRouter);
app.use('/feed', feedRouter);
app.use('/alert', alertRouter);
app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}!`));

module.exports = app;