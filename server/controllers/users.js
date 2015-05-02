var uid = require('rand-token').uid;
function register(req, res) {
  req.models.users.exists({
    login: req.body.login,
  }, function(err, exists) {
    if (err) {}
    if (exists) {
      console.log("EXIST");
      res.end("This login is already taken. Please choose another.")
    } else {
      console.log("NOT EXIST");
      req.models.users.create({
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
      }, function(err) {});
      var token = uid(16);
      req.models.tokens.create({
        token: token,
        user: req.body.login
      }, function() {});
      res.end();
    }
  });
}

function login(req, res) {
  req.models.users.exists({
    login: req.body.login,
    password: req.body.password
  }, function(err, exists) {
    if (exists) {
      console.log("All right!");
      req.session.isAuth = 'true';
      req.session.login = req.body.login;
    } else {
      req.session.isAuth = 'false';
      console.log("Wrong user data!");
    }
    res.json({isAuth: req.session.isAuth, login: req.session.login});
  });
}

function logout(req, res) {
    req.session.isAuth = 'false';
    req.session.login = '';
    console.log(req.session);
    res.end('Logout success!');
}

module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
