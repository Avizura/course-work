orm = require('orm');
var sessions = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.sessions = db.define("sessions", {
        session_id: {
          type: 'serial',
          key: true
        },
        expires: Number,
        data: String
      });
      next();
    }
  }));
}
module.exports = sessions;
