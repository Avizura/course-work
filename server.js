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
  saveUninitialized: true,
  cookie: {
    maxAge: 600000 //10 min
  }
}));
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/bootstrap-3.3.2'));
app.enable('trust proxy'); //to get ip adress

var users = require('./server/model/users.js')(app);
var tokens = require('./server/model/tokens.js')(app);
var errors = require('./server/model/errors.js')(app);
var events = require('./server/model/events.js')(app);
var visitors = require('./server/model/visitors.js')(app);
var sessions = require('./server/model/sessions.js')(app);
var hits = require('./server/model/hits.js')(app);

//Error handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
});

//Loading all modules
(function bootstrapRoutes() {
  util.walk(appPath + '/server/routes', 'middlewares', function(path) {
    //console.log(path);
    require(path)(app);
  });
})();

app.post('/visitor', function(req, res) {
  //console.log(req.body);
  req.models.visitors.create({
      visitor_id: req.ip,
      browser: req.body.browser,
      browser_version: req.body.browserVersion,
      OS: req.body.OS,
      OS_version: req.body.OS_Version,
      mobile: req.body.mobile,
      cookies: req.body.cookies,
      flash_version: req.body.flashVersion,
      viewport: req.body.viewport
    },
    function(err, items) {
      //console.log(err);
    });
  res.end('Object Visitor created successfully!');
});

app.post('/isAuth', function(req, res) {
  //console.log('onAuth');
  //console.log(req.session);
  res.json({
    isAuth: req.session.isAuth,
    login: req.session.login
  });
});

app.post('/hit', function(req, res) {
  //console.log('hit');
  //console.log(req.body);
  req.models.hits.get(req.body.token, function(err, hits) {
    //console.log('hits');
    //console.log(hits);
    //console.log(hits.count);
    hits.count++;
    //console.log(hits.count);
    hits.save(function(err) {
      //console.log('saved!!');
      //console.log(err);
    });
  });
  req.models.errors.
  res.end();
});

app.post('/hits', function(req, res) {
  var errorsCount,
    hitsCount;
  req.models.users.get(req.session.login, function(err, user) {
    //console.log('user');
    //console.log(user);
    //console.log(user.token);
    req.models.hits.get(user.token, function(err, hits) {
      //console.log('hits');
      //console.log(hits);
      hitsCount = hits.count;
      req.models.errors.count('error_id', function(err, count) {
        //console.log('count ' + count);
        errorsCount = count;
        //console.log('HOLYFUCK');
        //console.log(hitsCount);
        //console.log(errorsCount);
        res.json({
          hits: hitsCount,
          errors: errorsCount
        });
      });
    });
  });
});

app.post('/timeline', function(req, res) {
  req.models.errors.aggregate(['error_date']).count().groupBy('error_date').get(function(err, data){
    console.log('HALELUYA');
    console.log(data[0].error_date);
    res.json({
      data: data
    })
  });
  // req.models.errors.aggregate().distinct('error_date').get(function(err, dates) {
  //   var number = Object.keys(dates).length,
  //     counter = 0,
  //     array = [],
  //     temp;
  //   for (var property in dates) {
  //     if (dates.hasOwnProperty(property)) {
  //       if (dates[property] != null) {
  //         temp = new Date(dates[property]).toLocaleDateString();
  //         array.push({
  //           date: temp,
  //           count: ""
  //         });
  //         req.models.errors.count({
  //           'error_date': dates[property]
  //         }, function(err, count) {
  //           console.log('count' + count);
  //           array[counter].count = count;
  //         });
  //         counter++;
  //       }
  //     }
  //   }
  //   if (counter === number) {
  //     console.log('counter' + counter);
  //     console.log(array);
  //     res.json({
  //       data: array
  //     });
  //   }
  // });
});

server = app.listen(server_port, function() {
  console.log("Listening on port " + server_port);
});
