'use strict';
/*
  Module dependencies.
 */
var express = require('express'),
  app = express(),
  server,
  server_port = '5000',
  // path = require('path'),
  // mysql = require('mysql'),
  util             = require('./server/config/util.js'),
  appPath          = process.cwd(),
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
// app.set('views', __dirname + '/views');
// app.use(express.favicon());
// app.use(express.bodyParser());
// app.use(express.cookieParser());
// app.use(connectTimeout({ time: 10000 }));
// app.use(express.session({ store: mongoStore(app.set('db-uri')), secret: 'topsecret' }));
// app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
// app.use(express.methodOverride());
// app.use(stylus.middleware({ src: __dirname + '/public' }));
// app.use(express.static(__dirname + '/public'));
// app.set('mailOptions', {
//   host: 'localhost',
//   port: '25',
//   from: 'nodepad@example.com'
// });

//CONNECTION TO DATABASE
app.use(orm.express("mysql://root:prosport@localhost/track_db", {
  define: function(db, models, next) {
    models.browsers = db.define("browsers", {
      browser_id: {
        type: 'number',
        key: true
      },
      browser_name: String
    });
    models.errors = db.define("errors", {
      error_id: {
        type: 'serial',
        key: true
      },
      error_msg: String,
      error_url: String,
      error_line: 'number',
      error_column: 'number'
    });
    models.users = db.define("users", {
      login: {
        type: 'text',
        key: true
      },
      password: String
    });
    models.tokens = db.define("tokens", {
      token: {
        type: 'text',
        key: true
      },
      user: String
    });
    next();
  }
}));

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
app.get('/', function(req, res) {
  req.models.errors.find({
      error_id: 10
    },
    function(err, results) {
      res.write("<h1>Error msg: " + results[0].error_msg + "</h1>");
      res.write("<h1>Error url: " + results[0].error_url + "</h1>");
      res.write("lol");
    });
});

// app.post('/register', function(req, res) {
//   console.log(req.body);
//   req.models.users.exists({
//     login: req.body.login,
//   }, function(err, exists) {
//     if (err) {
//       console.log("HOLYSHIT");
//     }
//     if (exists) {
//       console.log("EXIST");
//       res.end("This login is already taken. Please choose another.")
//     } else {
//       console.log("NOT EXIST");
//       req.models.users.create({
//         login: req.body.login,
//         password: req.body.password
//       }, function(err) {
//         console.log('created');
//       });
//       var token = uid(16);
//       req.models.tokens.create({
//         token: token,
//         user: req.body.login
//       }, function() {
//         console.log('token');
//       });
//       res.end();
//     }
//   });
// });
//
// app.post('/login', function(req, res) {
//   req.models.users.exists({
//     login: req.body.login,
//     password: req.body.password
//   }, function(err, exists) {
//     if (exists) {
//       console.log("All right!");
//       res.send("All right!");
//     } else {
//       res.send("Wrong data!");
//     }
//   })
// });

//ERROR MSG
app.post('/error', function(req, res) {
  // console.log(req.body.msg.split(':')[0]);
  req.models.errors.create({
      error_msg: req.body.msg.split(':')[0],
      error_url: req.body.url,
      error_line: req.body.line,
      error_column: req.body.column
    },
    function(err, items) {
      console.log(err);
    });
  res.end();
});

app.post('/user', function(req, res) {
  //  лезешь в базу


  //req.sessin.user = USER


  res.send(user);
});

app.get('/geterror', function(req, res) {
  req.session.USER0;
  console.log(req.session);
  res.end(JSON.stringify(req.session));
})

server = app.listen(server_port, function() {
  console.log("Listening on port " + server_port);
});
