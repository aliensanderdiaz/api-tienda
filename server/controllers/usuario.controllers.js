let Usuario = require('../models/usuario.model');
const passport = require('passport');
const jwt = require('jsonwebtoken');
// var admin = require("firebase-admin");
const fs = require('fs');
const path = require('path');

let tokenSiigo;


exports.checkAuthenticated = function (req, res, next) {

    console.log({ headers: req.header });

    if (!req.header('authorization')) {
        console.log('NO VIENE CON EL HEADER authorization')
        return res.status(401).send({ message: 'Unauthorized requested. Missing authentication header' });
    }

    var idToken = req.header('authorization').split(' ')[1];

    console.log({ idToken })

    jwt.verify(idToken, process.env.secret, function (err, decodedToken) {
        console.log(decodedToken)
        if (err) {
            return res.json({
                success: false
            })
            // admin.auth().verifyIdToken(idToken)
            //     .then(function (decodedToken) {
            //         //console.log('heloooo')
            //         if (!decodedToken) return res.status(401).send({ message: 'Unauthorized requested. Authentication header invalid' });
            //         req.user = decodedToken;
            //         next();
            //     }).catch(function (error) {
            //         //console.log(error.message)//print error
            //         res.json({
            //             success: false
            //         })
            //     });
        } else {
            //console.log(decodedToken) // bar
            req.user = decodedToken.idUser;
            next();
        }
    });
}

exports.verificaAdminRole = function (req, res, next) {

    console.log('En el admin Role')

    console.log({ requser: req.user })

    if (!req.user) {
        console.log('No hay usuario')
        return res.status(401).json({
            ok: false,
            error: 'No estás autorizado para realizar esta acción.'
        })
    }

    Usuario.findOne({ _id: req.user })
        .exec((err, usuario) => {
            if (err || !usuario) {
                console.log('Error o no hay usuario')
                return res.status(500).json({
                    ok: false,
                    error: 'Error en el servidor'
                })
            }

            if (usuario.tipo !== 'administrador') {
                console.log('El usuario no es administrado')
                return res.status(401).json({
                    ok: false,
                    error: 'No estás autorizado para realizar esta acción.'
                })
            }

            console.log('Todo Bien')

            next();

        })
}

exports.signup = function (req, res, next) {
    // if (!req.user) {
    const user = new Usuario(req.body);
    user.provider = 'local';

    Usuario
        .findOne({ numeroId: req.body.numeroId })
        .exec((usuario, err) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Error en el Servidor'
                })
            }

            if (usuario) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Ya existe un usuario con ese número de identificación'
                })
            }

            user.save((err) => {
                if (err) {
                    return res.json(err.message)
                }
                res.json('usuario creado');
            });
        })

    // } else {
    // 	return res.redirect('/');
    // }
};

exports.login = function (req, res, next) {

    passport.authenticate('local', { session: false }, (err, user, info) => {
        // console.log({ info })
        // console.log({ user })

        if (err || !user) {
            return res.json({
                message: info.message,
                token: info.token,
                success: info.success
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.send(err)
            }

            // console.log({ USERLOGIN: user })

            idUser = user.id;
            const token = jwt.sign({ idUser }, process.env.secret);

            return res.json({
                message: 'valid credentials',
                success: true,
                token: token,
                tipo: user.tipo,
                usuario: `${user.primerNombre} ${user.apellidos.split(' ')[0]}`
            });
        });
    })(req, res);

}

exports.logout = function (req, res, next) {
    req.logout();
    res.json({ message: 'Logout Exitoso' });
}