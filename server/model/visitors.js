orm = require('orm');
var visitors = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.visitors = db.define("visitors", {
        visitor_id: {
          type: 'text',
          key: true
        },
        timestamp: Number,
        browser: String,
        browser_version: String,
        OS: String,
        OS_version: String,
        mobile: String,
        cookies: String,
        flash_version: String,
        viewport: String
      });
      next();
    }
  }));
}
module.exports = visitors;
