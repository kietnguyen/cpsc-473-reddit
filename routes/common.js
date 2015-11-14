exports.db_err_handler = function (err, res) {
  if (err) {
    console.warn(err.message);
    res.redirect(503, '/unavailable');
  }
};