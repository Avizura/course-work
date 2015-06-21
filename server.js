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
  host: 'localhost',
  user: 'root',
  password: 'prosport',
  database: 'track_db'
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
  saveUninitialized: true
    // cookie: {
    //   maxAge: 1800000 //20 min
    // }
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
var feedback = require('./server/model/feedback.js')(app);
var starred = require('./server/model/starred.js')(app);

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
  req.models.visitors.create({
      visitor_id: req.ip,
      browser: req.body.browser,
      browser_version: req.body.browserVersion,
      OS: req.body.OS,
      OS_version: req.body.OS_Version,
      mobile: req.body.mobile,
      cookies: req.body.cookies,
      viewport: req.body.viewport
    },
    function(err, items) {
      console.log(err);
    });
  res.end('Object Visitor created successfully!');
});

app.post('/isAuth', function(req, res) {
  res.json({
    isAuth: req.session.isAuth,
    login: req.session.login
  });
});

app.post('/hit', function(req, res) {
  var curDate = new Date().toISOString().substring(0, 10);
  req.models.hits.find({
    token: req.body.token,
    hit_date: curDate
  }, function(err, hits) {
    console.log('new hits');
    console.log(err, hits);
    if (hits[0]) {
      hits[0].count++;
      hits[0].save(function(err) {
        console.log('saved!!');
        // console.log(err);
      });
    } else {
      console.log('hits false');
      console.log('curDate ' + curDate);
      req.models.hits.create({
          token: req.body.token,
          hit_date: curDate,
          count: 1
        },
        function(err, items) {
          // console.log(err);
        });
    }
  });
  res.end();
});

app.post('/errorDelta', function(req, res) {
  req.models.tokens.get(req.session.login, function(err, user) {
    var request = "";
    var secondRequest = "";
    if (!req.body.selectedIcon && !req.body.selectedPeriod) {
      request = 'select count(*) from errors where error_timestamp between now() - interval 1 day and now();';
      secondRequest = 'select count(*) from errors where error_timestamp between now() - interval 3 day and now() - interval 2 day;';
    } else if (req.body.selectedIcon && req.body.selectedPeriod) {
      request = 'select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.error_url = \"' + req.body.selectedIcon + '\" and errors.error_timestamp > now() - interval \"' + req.body.selectedPeriod + '\" hour order by errors.error_timestamp desc;';
    } else if (req.body.selectedIcon) {
      request = 'select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.error_url = \"' + req.body.selectedIcon + '\" order by errors.error_timestamp desc;';
    } else if (req.body.selectedPeriod) {
      request = 'select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.error_timestamp > now() - interval ' + req.body.selectedPeriod + ' hour order by errors.error_timestamp desc;';
    }
    // console.log(request);
    connection.query(request, function(err, firstData, fields) {
      if (err) {
        console.log(err);
      }
      connection.query(secondRequest, function(err, secondData, fields) {
        if (err) {
          console.log(err);
        }
        console.log('im tired');
        console.log(firstData, secondData);
        res.json({
          first: firstData,
          second: secondData
        });
      });
    });
  });
});

app.post('/hitsAndErrors', function(req, res) {
  var errorsCount = 0;
  var hitsCount = 0;
  req.models.tokens.get(req.session.login, function(err, user) {
    if (user)
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
            errorsCount = count;
            res.json({
              hits: hitsCount,
              errors: errorsCount
            });
          });
        }
      });
  });
});

app.post('/pieChart', function(req, res) {
  var hitsCount = 0;
  req.models.tokens.get(req.session.login, function(err, user) {
    if (user)
      connection.query('select count from hits where token = \"' + user.token + '\" and hit_date > curdate() - interval \"' + req.body.selectedPeriod + '\" hour;', function(err, rows, fields) {
        if (err) {
          console.log(err);
        }
        if ('undefined' != typeof(rows[0])) {
          console.log('PIECHART');
          console.log(rows);
          for (var i = 0; i < rows.length; ++i) {
            hitsCount += rows[i].count;
          }
          connection.query('select count(*) from errors where token = \"' + user.token + '\" and error_timestamp > curdate() - interval \"' + req.body.selectedPeriod + '\" hour;', function(err, rows, fields) {
            if (err) {
              console.log(err);
            }
            if ('undefined' != typeof(rows[0])) {
              res.json({
                hits: hitsCount,
                errors: rows[0]['count(*)']
              });
            } else {
              console.log('error count not found!');
            }
          });
        } else {
          console.log('hits count not found!');
        }
      });
  });
});

app.post('/areaChart', function(req, res) {
  var request = "";
  req.models.tokens.get(req.session.login, function(err, user) {
    if (!user)
      return;
    if (!req.body.selectedPeriod) {
      request = 'select count(*), hits.hit_date, hits.count from errors join hits on date(errors.error_timestamp) = hits.hit_date and errors.token = hits.token where errors.token = \"' + user.token + '\" group by hit_date order by hit_date limit 6;';
    } else {
      request = 'select count(*), hits.hit_date, hits.count from errors join hits on date(errors.error_timestamp) = hits.hit_date and errors.token = hits.token where errors.token = \"' + user.token + '\" and hits.hit_date > curdate() - interval \"' + req.body.selectedPeriod + '\" hour group by hit_date order by hit_date limit 6;';
    }
    connection.query(request, function(err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if ('undefined' != typeof(rows[0])) {
        for (var i = 0; i < rows.length; ++i) {
          rows[i]['hit_date'] = new Date(rows[i]['hit_date']).toLocaleDateString('ru');
        }
        console.log(rows);
        res.json({
          data: rows
        });
      } else {
        console.log('error count not found!');
        res.end('');
      }
    });
  });
});

// app.post('/timeline', function(req, res) {
//   req.models.tokens.get(req.session.login, function(err, user) {
//     req.models.errors.aggregate(['error_date'], {token: user.token}).count().groupBy('error_date').order('error_date', 'Z').limit(6).get(function(err, errors) {
//       req.models.hits.find({token: user.token}, ['hit_date', 'Z'], {limit: 6}, function(err, hits) {
//         res.json({
//           errors: errors,
//           hits: hits
//         });
//       });
//     });
//   });
// });

app.post('/browsers', function(req, res) {
  req.models.tokens.get(req.session.login, function(err, user) {
    console.log('TOKEN');
    console.log(user);
    if (user)
      connection.query('select distinct visitors.browser, count(*) from errors join visitors on errors.visitor_id = visitors.visitor_id where errors.token = \"' + user.token + '\" group by visitors.browser order by count(*) desc limit 4;', function(err, rows, fields) {
        if (err) {
          console.log(err);
        }
        if ('undefined' != typeof(rows[0])) {
          console.log(rows);
          res.json(rows);
        } else {
          console.log('not found!');
          res.json();
        }
      });
  });
});

app.post('/urls', function(req, res) {
  req.models.tokens.get(req.session.login, function(err, user) {
    if (user)
      req.models.errors.aggregate(['error_url'], {
        token: user.token
      }).count().groupBy('error_url').order('count', 'Z').limit(4).get(function(err, data) {
        console.log('URLS');
        // console.log(data);
        res.json({
          error: data
        });
      })
  });
});

app.post('/msgs', function(req, res) {
  req.models.tokens.get(req.session.login, function(err, user) {
    if (user)
      req.models.errors.aggregate(['error_msg'], {
        token: user.token
      }).count().groupBy('error_msg').order('count', 'Z').limit(4).get(function(err, data) {
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
  req.models.tokens.get(req.session.login, function(err, user) {
    if (!user)
      return;
    if (!req.body.selectedIcon && !req.body.selectedPeriod) {
      request = 'select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id where errors.token = \"' + user.token + '\" order by errors.error_timestamp desc;';
    } else if (req.body.selectedIcon && req.body.selectedPeriod) {
      request = 'select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.token = \"' + user.token + '\" and errors.error_url = \"' + req.body.selectedIcon + '\" and errors.error_timestamp > now() - interval \"' + req.body.selectedPeriod + '\" hour order by errors.error_timestamp desc;';
    } else if (req.body.selectedIcon) {
      request = 'select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.token = \"' + user.token + '\" and errors.error_url = \"' + req.body.selectedIcon + '\" order by errors.error_timestamp desc;';
    } else if (req.body.selectedPeriod) {
      request = 'select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.token = \"' + user.token + '\" and errors.error_timestamp > now() - interval ' + req.body.selectedPeriod + ' hour order by errors.error_timestamp desc;';
    }
    // console.log(request);
    connection.query(request, function(err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if ('undefined' != typeof(rows[0])) {
        console.log('RECENT');
        // console.log(rows);
        res.json(rows);
      } else {
        console.log('not found!');
        res.json();
      }
    });
  });
});

app.post('/recentUrls', function(req, res) {
  connection.query('select distinct error_url from errors;', function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
    if ('undefined' != typeof(rows[0])) {
      console.log(rows);
      res.json(rows);
    } else {
      console.log('not found!');
      res.json();
    }
  });
});

app.post('/users', function(req, res) {
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
    } else {
      console.log('not found!');
      res.json();
    }
  });
});

app.post('/daily', function(req, res) {
  connection.query('select date(error_timestamp), count(*) from errors group by date(error_timestamp) order by date(error_timestamp) desc;', function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
    if ('undefined' != typeof(rows[0])) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i]['date(error_timestamp)'] = new Date(rows[i]['date(error_timestamp)']).toDateString();
      }
      console.log(rows);
      res.json(rows);
    } else {
      console.log('not found!');
      res.json();
    }
  });
});

app.post('/errorInfo', function(req, res) {
  connection.query('select count(*), errors.stacktrace, errors.visitor_id, visitors.timestamp, visitors.browser, visitors.browser_version, visitors.OS, visitors.OS_version, visitors.cookies, visitors.mobile, visitors.viewport, visitors.local_time from errors join visitors on errors.visitor_id = visitors.visitor_id where errors.error_id = \"' + req.body.error_id + '\" group by visitor_id order by count(*) desc;', function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
    if ('undefined' != typeof(rows[0])) {
      console.log(rows);
      res.json(rows);
    } else {
      console.log('not found!');
      res.json();
    }
  });
});

app.post('/starred', function(req, res) {
  console.log(req.body);
  req.models.starred.create({
      error_id: req.body.error_id,
      login: req.session.login
    },
    function(err, items) {
      console.log(err);
      res.end();
    });
});

app.post('/getStarred', function(req, res) {
  var request = "";
  var str = [];
  var lol = '(';
  connection.query("select error_id from starred", function(err, rows) {
    for (var i = 0; i < rows.length; ++i) {
      str.push(rows[i].error_id);
    }
    lol += str.toString();
    lol += ')';
    request = 'select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id  where errors.error_id in ' + lol + ' order by errors.error_timestamp desc;';
    console.log(request);
    connection.query(request, function(err, rows) {
      console.log(rows);
      res.json(rows);
    });
  });
});

// req.models.starred.find({}).only("error_id").run(function(err, errors){
// db.driver.execQuery("SELECT * from errors where error_id = "+errors[0].error_id+";", function (err, data) {
// console.log(err, data);
// });

app.post('/fromVisitor', function(req, res) {
  console.log("AHAHHAHAHAHAHAHAHAHAHAHHA");
  console.log(req.body);
  if(!req.body.visitor_id)
    return;
  req.models.tokens.get(req.session.login, function(err, user) {
    if(!user)
      return;
    connection.query('select errors.error_id, errors.error_timestamp, errors.error_msg, errors.error_url, visitors.browser, visitors.OS from errors join visitors on errors.visitor_id = visitors.visitor_id where errors.token = \"' + user.token + '\" and errors.visitor_id = \"' + req.body.visitor_id + '\" order by errors.error_timestamp desc;', function(err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if ('undefined' != typeof(rows[0])) {
        console.log('ATAZEDAZY');
        console.log(rows);
        res.json(rows);
      } else {
        console.log('not found!');
        res.json();
      }
    });
  });
});

app.post('/feedback', function(req, res) {
  console.log(req.body);
  req.models.feedback.create({
      login: req.session.login,
      feedback_type: req.body.feedbackType,
      text: req.body.text
    },
    function(err, items) {
      console.log(err);
      res.end();
    });
});

server = app.listen(server_port, function() {
  console.log("Listening on port " + server_port);
});
