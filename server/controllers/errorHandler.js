//ERROR MSG
function errorHandler(req, res) {
  console.log(req.body);
  console.log(req.body.msg.split(':'));
  req.models.errors.create({
      error_msg: req.body.msg.split(':')[0],
      error_url: req.body.url,
      error_line: req.body.line,
      error_column: req.body.column,
      token: req.body.token,
      visitor_id: req.ip
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
    if (exists){
      console.log('Visitor already exist');
      res.end('true');
    }
    else res.end('false');
  });
}
module.exports = errorHandler;
