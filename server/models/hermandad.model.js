var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var hermandadSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    productos: [
        {
            _id: false,
            producto: {
                type: Schema.ObjectId,
                ref: 'Producto'
            },
            detalles: Schema.Types.Mixed,
        }
    ],
    propiedades: [
        {
            _id: false,
            valor: String,
            codigo: String,
            opciones: [ String ]
        }
    ]
});


module.exports = mongoose.model('Hermandad', hermandadSchema);