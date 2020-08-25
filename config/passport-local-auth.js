const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../server/models/usuario.model');

const jwt = require('jsonwebtoken');


passport.use(new LocalStrategy(
  {
    usernameField: 'numeroId'
  },
  (numeroId, password, done) => {
    console.log('Buscando desde el config passport')
    User.findOne({
      numeroId: numeroId
    }, (err, user) => {
      if (err) {
        console.log('ERROR BUSCANDO EL USUARIO EN EL CONFIG PASSPORT')
        return done(null, false, { message: `Se encontró un error buscando el usuario.` });
      }

      if (!user) {
        console.log('NO HAY USUARIO EN EL CONFIG PASSPORT')
        return done(null, false, {
          message: 'El usuario no ha sido encontrado',
          success: false,
          token: ''
        });
      }

      console.log('SI HAY UN USUARIO EN EL CONFIG DEL PASSPORT')

      if (!user.password) {
        console.log('ESTE USUARIO NO TIENE PASSWORD')
        return done(null, false, {
          message: 'El usuario no posee contraseña',
          success: false,
          token: ''
        });
      }


      if (!user.authenticate(password)) {

        return done(null, false, {
          message: 'La contraseña no coincide',
          success: false,
          token: ''
        });
      }

      return done(null, user);
    });
  }));

exports.estaAutenticado = (req, res, next) => {

  console.log('Funcion esta autenticado, archivo configuracion passport');

  if (!req.header('Authorization')) {
    return res.status(401).send({
      message: 'No se encuentró el token.'
    });
  }

  var idToken = req.header('Authorization').split(' ')[1];

  jwt.verify(idToken, 'SECRETO', function (err, decodedToken) {
    if (err) {
      return res.status(401).send({
        message: 'El token enviado no es válido.'
      });
    } else {
      req.user = decodedToken;
      next();
    }
  });
}