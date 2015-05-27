orm = require('orm');
var tokens = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.tokens = db.define("tokens", {
        login: {
          type: 'text',
          key: true
        },
        token: String
      });
      next();
    }
  }));
}
module.exports = tokens;
