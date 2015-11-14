var MongoClient = require('mongodb').MongoClient,
    dbUrl = 'mongodb://127.0.0.1:27017/cpsc473',
    db_err_handler = require('./common.js').db_err_handler,
    message = '';

exports.comment = function(req, res) {
  var urlScore = req.params.score;
  var urlTitle = req.params.title;
  res.render('comment',
             { title: 'Teeny-tiny mini-Reddit | Comments on '+ urlTitle,
              authenticated: req.headers.authorization,
              urlTitle: urlTitle });
};

exports.logout = function (req, res) {
  res.status(401)
  .render('logout',
          { title: 'Teeny-tiny mini-Reddit | Logout',
           authenticated: req.headers.authorization });
};

exports.submit = function (req, res) {
  if (req.method !== "POST") return;

  console.log("Submitting a link... " + JSON.stringify(req.body));
  var data = req.body;
  MongoClient.connect(dbUrl, function(err, db) {
    db_err_handler(err, res);

    var redditCol = db.collection('reddit');
    redditCol.findOne(
      { url: data.url },
      function (err, doc) {
        db_err_handler(err, res);

        // URL not found
        if (doc === null) {
          redditCol.insert(
            { title: data.title, url: data.url, score: 0 },
            function (err, insDoc) {
              db_err_handler(err, res);

              message = "Successfully submit a new URL";
              res.redirect(302, 'user');
            });
        } else {
          message = "URL is already submitted!";
          res.redirect(302, 'submit-a-link');
        }
      });
  });
};

exports.user_index = function (req, res) {
  MongoClient.connect(dbUrl, function(err, db) {
    db_err_handler(err, res);

    var redditCol = db.collection("reddit");
    redditCol.aggregate(
      { $project: { _id: 0, title: 1, score: 1 } },
      { $sort: { score: -1 } },
      function (err, doc) {
        res.render('index', {
          title: 'Teeny-tiny mini-Reddit | User',
          authenticated: req.headers.authorization,
          bookmarks: doc,
          message: message
        });
        message = '';
      });
  });
};

exports.vote = function (req, res) {
  console.log("Voting... " + JSON.stringify(req.body));

  var data = req.body;
  MongoClient.connect(dbUrl, function(err, db) {
    db_err_handler(err, res);

    var redditCol = db.collection('reddit');
    var addedPts = (data.direction === 'up' ? 1 : -1);

    redditCol.update(
      { title: data.title },
      { $inc: { score: addedPts } },
      function (err, doc) {
        db_err_handler(err, res);
        console.log("Voting " + data.direction + " \"" + data.title + "\" ...");
        res.redirect(302, '/user');
      });
  });
};
