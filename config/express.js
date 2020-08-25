const express = require('express');
const passport = require('passport');
const cors = require('cors')
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const http = require('http');

module.exports = function () {
    const app = express();

    if (process.env.NODE_ENV !== 'production') {
        console.log({ cors: 'NO production' })
        app.use(morgan('dev'));
        app.use(cors())
    } else {
        console.log({ cors: 'production' })
        app.use(compression());
        app.use(cors())
    }

    const server = http.createServer(app);

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.set('json spaces', 4);

    app.use(express.static('public'))

    require('../config/passport-local-auth');
    app.use(passport.initialize());

    app.use(require('./../server/routes/index.routes'));



    return server;
};