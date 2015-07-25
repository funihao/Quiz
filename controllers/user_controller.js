var users = {
              admin: {id: 1, username: "admin", password: "12345"},
              pepe: {id: 2, username: "pepe", password: "67890"}
            };

// Comprueba si el usuario está registrado en users
// Si la autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function (login, password, callback) {
  console.log("Autenticando: " + users[login].username);
  if (users[login]) {
    if (password === users[login].password) {
      console.log("match Password");
      callback(null, users[login]);
    } else {callback(new Error('Password erroneo.'));}
  } else {callback(new Error('No existe el usuario.'));}
};
