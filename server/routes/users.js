var users = require('../controllers/users.js');
module.exports = function(app){
  app.route('/user/registration')
    .post(users.register);

  app.route('/user/login')
    .post(users.login);
}
