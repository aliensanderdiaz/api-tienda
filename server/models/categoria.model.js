var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var categoriaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    slug: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Categoria' },
    detalles: [
        []
    ]
});


module.exports = mongoose.model('Categoria', categoriaSchema);