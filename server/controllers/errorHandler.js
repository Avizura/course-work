//ERROR MSG
function errorHandler(req, res) {
  console.log('New Error!');
  console.log(req.body);
  req.models.errors.create({
      error_msg: req.body.msg.split(':')[0],
      error_url: req.body.url,
      error_line: req.body.line,
      error_column: req.body.column,
      token: req.body.token,
      visitor_id: req.ip,
      error_date: new Date().toLocaleDateString("ru"), //magic,
      stacktrace: req.body.stack,
      local_time: req.body.time
    },
    function(err, items) {
      console.log(err);
    });
  req.models.visitors.exists({
    visitor_id: req.ip
  }, function(err, exists) {
    if (err) {
      console.log(err);
    }
    if (exists) {
      console.log('Visitor already exist');
      res.end('true');
    } else {
      console.log('New visitor');
      res.end('false');
    }
  });
}
module.exports = errorHandler;
