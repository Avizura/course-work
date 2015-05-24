orm = require('orm');
var hits = function(app) {
  app.use(orm.express("mysql://root:prosport@localhost/track_db", {
    define: function(db, models, next) {
      models.hits = db.define("hits", {
        token: {
          type: 'text',
          key: true
        },
        hit_date: {
          type: 'text',
          key: true
        },
        count: Number
      });
      next();
    }
  }));
}
module.exports = hits;
