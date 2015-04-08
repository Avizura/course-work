var uid = require('rand-token').uid;
function register(req, res) {
  req.models.users.exists({
    login: req.body.login,
  }, function(err, exists) {
    console.log('HANDLING!!!!');
    if (err) {}
    if (exists) {
      console.log("EXIST");
      res.end("This login is already taken. Please choose another.")
    } else {
      console.log("NOT EXIST");
      req.models.users.create({
        login: req.body.login,
        password: req.body.password
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
      res.send("All right!");
    } else {
      console.log("Wrong user data!");
      res.send("Wrong data!");
    }
  });
}

module.exports.register = register;
module.exports.login = login;
