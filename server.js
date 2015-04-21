'use strict';
/*
  Module dependencies.
 */
var express = require('express'),
  app = express(),
  server,
  server_port = '5000',
  // path = require('path'),
  util = require('./server/config/util.js'),
  appPath = process.cwd(),
  orm = require('orm'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  SessionStore = require('express-mysql-session'),
  allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  };


var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'prosport',
  database: 'track_db'
}

var sessionStore = new SessionStore(options)

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

var errors = require('./server/model/errors.js')(app);
var events = require('./server/model/events.js')(app);
var users = require('./server/model/users.js')(app);
var visitors = require('./server/model/visitors.js')(app);
var sessions = require('./server/model/sessions.js')(app);
var tokens = require('./server/model/tokens.js')(app);

//error handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
});

function bootstrapRoutes() {
  util.walk(appPath + '/server/routes', 'middlewares', function(path) {
    console.log(path);
    require(path)(app);
  });
}
bootstrapRoutes();

//ERROR MSG
app.post('/error', function(req, res) {
  // console.log(req.body.msg.split(':')[0]);
  console.log(req.body);
  req.models.errors.create({
      error_msg: req.body.msg.split(':')[0],
      error_url: req.body.url,
      error_line: req.body.line,
      error_column: req.body.column,
      token: req.body.token,
      visitor_id: 225
    },
    function(err, items) {
      console.log(err);
    });
  res.end();
});

app.post('/isAuth', function(req, res) {
  // req.session.USER0;
  console.log(req.session);
  res.end(req.session.isAuth)
  // res.end(JSON.stringify(req.session));
})

server = app.listen(server_port, function() {
  console.log("Listening on port " + server_port);
});
