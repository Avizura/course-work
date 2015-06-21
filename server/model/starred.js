orm = require('orm');
var starred = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.starred = db.define("starred", {
        error_id: {
          type: 'integer',
          key: true
        },
        login: String
      });
      next();
    }
  }));
}
module.exports = starred;
