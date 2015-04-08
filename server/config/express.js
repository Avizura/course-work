util             = require('./util'),
appPath          = process.cwd();


module.exports = function(app) {

  function bootstrapRoutes() {
    util.walk(appPath + '/server/routes', 'middlewares', function(path) {
      console.log(path);
      require(path)(app);
    });
  }
  bootstrapRoutes();
}
