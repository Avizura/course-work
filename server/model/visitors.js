orm = require('orm');
var visitors = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.visitors = db.define("visitors", {
        visitor_id: {
          type: 'number',
          key: true
        },
        timestamp: Number,
        time_on_page: Number,
        visitor_time: Number,
        browser: String,
        OS: String,
        viewport: String
      });
      next();
    }
  }));
}
module.exports = visitors;
