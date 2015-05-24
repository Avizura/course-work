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
        error_date: String,
        visitor_id: String
      });

      // models.visitors = db.define("visitors", {
      //   visitor_ip: String,
      //   timestamp: Number,
      //   browser: String,
      //   browser_version: String,
      //   OS: String,
      //   OS_version: String,
      //   mobile: String,
      //   cookies: String,
      //   flash_version: String,
      //   viewport: String
      // });
      // models.errors.hasOne('visitor', models.visitors);
      next();
    }
  }));
}
module.exports = errors;
