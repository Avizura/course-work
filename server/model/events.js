orm = require('orm');
var events = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.events = db.define("events", {
        event_id: {
          type: 'serial',
          key: true
        },
        event_name: String,
        event_timestamp: Number,
        token: String,
        visitor_id: Number
      });
      next();
    }
  }));
}
module.exports = events;
