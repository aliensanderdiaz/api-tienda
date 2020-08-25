const express = require('express');

let app = express();

let ordenTiendaControllers = require('../controllers/orden-tienda.controllers');

app.post('/orden-tienda', ordenTiendaControllers.crearOrdenTienda);
app.get('/orden-tienda', ordenTiendaControllers.obtenerOrdenesTienda);
app.get('/orden-tienda/:id', ordenTiendaControllers.obtenerOrdenTienda);

module.exports = app;