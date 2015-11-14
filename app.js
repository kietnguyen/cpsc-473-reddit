var express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require('./routes'),
    user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var auth = express.basicAuth(function(user, pass, fn) {
  routes.basic_auth(user, pass, function(err, userFound) {
    if (err) console.warn(err.message);
    fn(null, userFound);
  });
});

app.get('/', routes.index);
app.post('/register', routes.register);
app.get('/unavailable', routes.unavail);
app.get('/click/:title', routes.click);
app.get('/comments/:title', user.comment);

app.get('/user', auth, user.user_index);
app.post('/vote', auth, user.vote);
app.post('/submit', auth, user.submit);
app.get('/logout', auth, user.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
