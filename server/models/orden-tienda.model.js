var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ordenTiendaSchema = new Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: String,
    cedula: String,
    telefono: String,
    primerNombre: String,
    segundoNombre: String,
    apellidos: String,
    correoElectronico: String,
    direccion1: String,
    direccion2: String,
    facturarAEmpresa: Boolean,
    razonSocial: String,
    nit: String,
    metodoPago: String,
    total: Number,
    subtotal: Number,
    iva: Number,
    carrito: [{
        _id: false,
        producto: {
            type: Schema.ObjectId,
            ref: 'Producto'
        },
        qty: Number,
        unitPrice: Number,
        totalPrice: Number,
    }],
});

module.exports = mongoose.model('OrdenTienda', ordenTiendaSchema);