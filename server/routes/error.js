var errorHandler = require('../controllers/errorHandler.js');
module.exports = function(app) {
  app.route('/error')
    .post(errorHandler);
}
