const express = require('express');

let app = express();

let usuarioControllers = require('../controllers/usuario.controllers');

//-------------- Inicio rutas para logearse ----------------//
//app.get(usuarioControllers.checkAuthenticated, usuarioControllers.usuariosListaCompleta)
// app.post('/sign-up', usuarioControllers.signup);
app.post('/log-in', usuarioControllers.login);
app.get('/log-out', usuarioControllers.logout);
//-------------- Fin rutas para logearse ----------------//

module.exports = app;