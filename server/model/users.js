orm = require('orm');
var users = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.users = db.define("users", {
        login: {
          type: 'text',
          key: true
        },
        password: String,
        email: String
      });
      next();
    }
  }));
}
module.exports = users;
