var message = '';

exports.basic_auth = function (user, pass, callback) {
  console.log("Authenticating user... \"" + user + "\"");

  users.findOne(
    { user: user },
    { _id: 0, user: 1, pass: 1 },
    function (err, doc) {
      if (err) {
        callback(new Error("Invalid username/password"));
      } else {
        console.log("Found user... " + JSON.stringify(doc));

        if (doc === null) {
          callback(new Error("Invalid username"));
        } else if (doc.pass === pass) {
          callback(null, doc.user);
        } else {
          callback(new Error("Wrong password"));
        }
      }
    });
};


exports.click = function (req, res) {
  var title = req.params.title;
  if (title !== undefined) {
    reddit.findOne(
      { title: title },
      { _id: 0, url: 1 },
      function (err, doc) {
        if (err) {
          console.warn(err.message);
          res.redirect(503, '/unavailable');

        } else {
          console.log("Redirecting to... \"" + doc.url + "\"");
          res.redirect(302, doc.url);
        }
      });
  }
};



exports.index = function (req, res) {
  reddit.aggregate(
    { $project: { _id: 0, title: 1, score: 1 } },
    { $sort: { score: -1 } },
    function (err, doc) {
      res.render('index', {
        title: 'Teeny-tiny mini-Reddit | Front page',
        bookmarks: doc,
        authenticated: req.headers.authorization,
        message: message
      });
      message = '';
    });
};


exports.register = function (req, res) {
  console.log("Creating new user... " + JSON.stringify(req.body));

  var data = req.body;
  users.findOne(
    { user: data.username },
    { _id: 0, user: 1 },
    function (err, doc) {
      if (err) {
        console.warn(err.message);
        res.redirect(503, '/unavailable');

      } else {
        console.log("Found user... " + JSON.stringify(doc));

        if (doc === null) {
          users.insert(
            { user: data.username, pass: data.password },
            function (err, objects) {
              if (err) {
                console.warn(err.message);
                res.redirect(503, '/unavailable');

              } else {
                message = "Successfully register a new user";
                res.redirect(302, '/');
              }

            });

        } else {
          message = "Username is already taken.";
          res.redirect(302, '/');
        }
      }
    });
};


exports.unavail = function (req, res) {
  res.render('unavail',
             {title: 'Teeny-tiny mini-Reddit | Service Unavailable',
              authenticated: req.headers.authorization});
};
