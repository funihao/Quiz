// GET /login -- Formulario de login
exports.new = function (req, res) {
  var errors = req.session.errors || {};

  res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear la session
exports.create = function (req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function (error, user) {

    if (error) { // Si hay erroes retornamos mensaje de error de sesión
      req.session.errors = [{"messge": 'Se ha producido un error: ' + error}];
      req.redirect("/login");
      retturn;
    };
    console.log("Creando sesión");
    // Crear req.session.user y guardar campos id y username
    // La sesión se define por la existencia de: req.session.user
    req.session.user = {id: user.id, username: user.username};
    console.log(req.session.user);
    console.log("Redirección a: " + req.session.redir.toString());
    // redirección a path anterior al login
    res.redirect(req.session.redir.toString());
  });
};

// DELETE /logout -- Destruir sesión
exports.destroy = function (req, res) {
  delete req.session.user;
  // redirección a path anterior al login
  res.redirect(req.session.redir.toString());
};
