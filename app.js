var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverrive = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz funihao'));
app.use(session());
app.use(methodOverrive('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function (req, res, next) {
  // Guardar path en session.redir para redir despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// Control de tiempo "timeout session"
app.use(function (req, res, next) {
  // Comprobar hay sesión
  if (req.session.user) {
    // Creamos variable timer
    // if (!req.session.timer) {req.session.timer = Date.now()};
    // console.log("Timer creado --> " + req.session.timer);

    if ((Date.now() - req.session.timer) > 120000 ) {
      // Borramos los datos de sesión
      delete req.session.user;
      delete req.session.timer;
      console.log("Session time out: closed session ......");
      // Redirigimos a la página anterior
      res.redirect(req.session.redir.toString());
    } else {
      console.log("Update session timer");
      req.session.timer = Date.now();
    }

    // Actualizamos las variables de sesión para las vistas
    res.locals.session = req.session;
  }

  next();
});

app.use('/', routes);

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
