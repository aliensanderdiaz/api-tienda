const mongoose = require('mongoose');

module.exports = function () {

    let urlDB;

    if (process.env.ENVIRONMENT === 'development') {
        console.log({ ENVIRONMENT: process.env.ENVIRONMENT, mensaje: 'Estamos en modo desarrollo' });
        urlDB = process.env.MONGO_URI;
        console.log({ mensaje: 'Hola estoy en la configuración de mongoose', urlDB })
    } else {
        console.log({ ENVIRONMENT: process.env.ENVIRONMENT, mensaje: 'Estamos en modo producción' });
        urlDB = process.env.MONGO_URI;
        console.log({ mensaje: 'Hola estoy en la configuración de mongoose', urlDB })
    }

    const db = mongoose.connect(urlDB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    return db
};