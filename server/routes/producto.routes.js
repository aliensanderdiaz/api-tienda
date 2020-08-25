const express = require('express');

let app = express();

let productoController = require('../controllers/producto.controllers');

app.get('/productos/categoria/:categoriaId', productoController.productosCategoria);
app.get('/productos-disponibles-en-tienda', productoController.productosDisponiblesEnTienda);
app.get('/productos-mostrar-en-tienda', productoController.productosMostrarEnTienda);
app.get('/producto-por-plu/:plu', productoController.obtenerProductoPorPLU);


module.exports = app;