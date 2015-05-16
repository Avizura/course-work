orm = require('orm');
var errors = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.errors = db.define("errors", {
        error_id: {
          type: 'serial',
          key: true
        },
        error_msg: String,
        error_url: String,
        error_line: Number,
        error_column: Number,
        error_timestamp: String,
        token: String,
        visitor_id: Number,
        error_date: String
      });
      next();
    }
  }));
}
module.exports = errors;
