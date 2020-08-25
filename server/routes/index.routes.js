const express = require('express');

const app = express();

app.use(require('./producto.routes'));
app.use(require('./orden-tienda.routes'));
app.use(require('./usuario.routes'));

module.exports = app;