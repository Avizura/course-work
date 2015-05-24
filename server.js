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

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'prosport',
  database : 'track_db'
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

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
    maxAge: 1800000 //20 min
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
  var mydate = new Date().toLocaleDateString('ru');
  req.models.hits.find({token: req.body.token, hit_date: mydate}, function(err, hits) {
    console.log('hits');
    console.log(hits);
    if (hits[0]) {
      hits[0].count++;
      hits[0].save(function(err) {
        console.log('saved!!');
        console.log(err);
      });
    }
    else{
      console.log('hits false');
      var mydate = new Date().toLocaleDateString('ru');
      console.log('mydate ' + mydate);
      req.models.hits.create({
          token: req.body.token,
          hit_date: mydate,
          count: 1
        },
        function(err, items) {
          console.log(err);
        });
    }
  });
  res.end();
});

app.post('/hits', function(req, res) {
  var errorsCount = "";
  var hitsCount = 0;
  // var curDate =  new Date().toLocaleDateString('ru');
  req.models.users.get(req.session.login, function(err, user) {
    req.models.hits.find({
      token: user.token
    }, function(err, hits) {
      console.log('HITS!!!');
      console.log(err, hits);
      if (hits) {
        for (var i = 0; i < hits.length; ++i) {
          hitsCount += hits[i].count;
        }
        console.log(hitsCount);
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
      }
    });
  });
});

app.post('/timeline', function(req, res) {
  req.models.users.get(req.session.login, function(err, user) {
    req.models.errors.aggregate(['error_date'], {token: user.token}).count().groupBy('error_date').order('error_date', 'Z').limit(6).get(function(err, errors) {
      req.models.hits.find({token: user.token}, ['hit_date', 'Z'], {limit: 6}, function(err, hits) {
        console.log('HITS DATA NOW!');
        console.log(hits);
        console.log('HALELUYA');
        console.log(errors);
        res.json({
          errors: errors,
          hits: hits
        });
      });
    });
  });
});

app.post('/browsers', function(req, res) {
  req.models.tokens.find({login: req.session.login}, function(err, data) {
    console.log('TOKEN');
    console.log(data);
    connection.query('select visitors.browser, count(*) from errors join visitors on errors.visitor_id = visitors.visitor_id where errors.token = \"' + data[0].token + '\" group by errors.visitor_id order by count(*) desc limit 4;', function(err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if ('undefined' != typeof(rows[0])) {
        console.log(rows);
        res.json(rows);
      } else {
        console.log('not found!');
      }
    });
  });
});

app.post('/urls', function(req, res){
  req.models.users.get(req.session.login, function(err, user) {
    req.models.errors.aggregate(['error_url'], {token: user.token}).count().groupBy('error_url').order('count', 'Z').limit(4).get(function(err, data) {
      console.log('URLS');
      // console.log(data);
        res.json({
          error: data
        });
    })
  });
});

app.post('/msgs', function(req, res){
  req.models.users.get(req.session.login, function(err, user) {
    req.models.errors.aggregate(['error_msg'], {token: user.token}).count().groupBy('error_msg').order('count', 'Z').limit(4).get(function(err, data) {
      console.log('MESSAGES');
      // console.log(data);
        res.json({
          error: data
        });
    })
  });
});

app.post('/recent', function(req, res) {
  var request = "";
  if (!req.body.selectedIcon && !req.body.selectedPeriod) {
    request = 'select errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id order by errors.error_timestamp desc;'
  } else if (req.body.selectedIcon && req.body.selectedPeriod) {
    request = 'select errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.error_url = \"' + req.body.selectedIcon + '\" and errors.error_timestamp > now() - interval \"' + req.body.selectedPeriod + '\" hour order by errors.error_timestamp desc;';
  } else if (req.body.selectedIcon) {
    request = 'select errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.error_url = \"' + req.body.selectedIcon + '\" order by errors.error_timestamp desc;';
  } else if (req.body.selectedPeriod) {
    request = 'select errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.error_timestamp > now() - interval ' + req.body.selectedPeriod + ' hour order by errors.error_timestamp desc;';
  }
  console.log(request);
  connection.query(request, function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
    if ('undefined' != typeof(rows[0])) {
      console.log('RECENT');
      console.log(rows);
      res.json(rows);
    } else {
      console.log('not found!');
    }
  });
});

app.post('/recentUrls', function(req, res){
  connection.query('select distinct error_url from errors;', function(err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if ('undefined' != typeof(rows[0])) {
        console.log(rows);
        res.json(rows);
      }
      else {
        console.log('not found!');
      }
  });
});

app.post('/users', function(req, res){
  console.log('icon');
  console.log(req.body);
  console.log(req.body.selectedIcon, req.body.selectedPeriod);
  var request = "";
  if (!req.body.selectedIcon && !req.body.selectedPeriod) {
    request = 'select count(*), errors.visitor_id, visitors.timestamp, visitors.browser, visitors.browser_version, visitors.OS, visitors.OS_version, visitors.cookies, visitors.mobile, visitors.viewport from errors join visitors on errors.visitor_id = visitors.visitor_id group by visitor_id order by count(*) desc;';
  } else if (req.body.selectedIcon && req.body.selectedPeriod) {
    request = 'select count(*), errors.visitor_id, visitors.timestamp, visitors.browser, visitors.browser_version, visitors.OS, visitors.OS_version, visitors.cookies, visitors.mobile, visitors.viewport from errors join visitors on errors.visitor_id = visitors.visitor_id where errors.error_url = \"' + req.body.selectedIcon + '\" and errors.error_timestamp > now() - interval \"' + req.body.selectedPeriod + '\" hour group by visitor_id order by count(*) desc;';
  } else if (req.body.selectedIcon) {
    request = 'select count(*), errors.visitor_id, visitors.timestamp, visitors.browser, visitors.browser_version, visitors.OS, visitors.OS_version, visitors.cookies, visitors.mobile, visitors.viewport from errors join visitors on errors.visitor_id = visitors.visitor_id where errors.error_url = \"' + req.body.selectedIcon + '\" group by visitor_id order by count(*) desc;';
  } else if (req.body.selectedPeriod) {
    request = 'select count(*), errors.visitor_id, visitors.timestamp, visitors.browser, visitors.browser_version, visitors.OS, visitors.OS_version, visitors.cookies, visitors.mobile, visitors.viewport from errors join visitors on errors.visitor_id = visitors.visitor_id where errors.error_timestamp > now() - interval \"' + req.body.selectedPeriod + '\" hour group by visitor_id order by count(*) desc;';
  }
  connection.query(request, function(err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if ('undefined' != typeof(rows[0])) {
        console.log(rows);
        res.json(rows);
      }
      else {
        console.log('not found!');
      }
  });
});

app.post('/daily', function(req, res){
  connection.query('select error_date, count(*) from errors group by error_date order by count(*) desc;', function(err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if ('undefined' != typeof(rows[0])) {
        console.log(rows);
        res.json(rows);
      }
      else {
        console.log('not found!');
      }
  });
});

server = app.listen(server_port, function() {
  console.log("Listening on port " + server_port);
});
