orm = require('orm');
var feedback = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.feedback = db.define("feedback", {
        id: {
          type: 'serial',
          key: true
        },
        login: Number,
        feedback_type: String,
        text: String
      });
      next();
    }
  }));
}
module.exports = feedback;
