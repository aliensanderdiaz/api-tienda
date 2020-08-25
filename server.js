require('dotenv').config()
const configureMongoose = require('./config/mongoose');
const configureExpress = require('./config/express');

configureMongoose();
const app = configureExpress();


app.listen(process.env.PORT);

module.exports = app;