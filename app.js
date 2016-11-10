'use strict'

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const config = require('config-lite');


const app = express();

const flash = require('connect-flash');

const session = require('express-session');

const MongoStore = require('connect-mongo')(session);


// view engine setup
app.set('port', process.env_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  cookie: {maxAge: config.session.maxAge},
  store: new MongoStore({
    url: config.mongodb
  }),
  resave: false,
  saveUninitialized: false
}));

routes(app);
app.listen(config.port,  function() {
  console.log('Express server listening on prot' + app.get('port'));
})

// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

