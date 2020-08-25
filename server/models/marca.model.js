var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var marcaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    slug: { type: String, required: [true, 'El slug es necesario'] },
    categorias: [{
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    }]
});


module.exports = mongoose.model('Marca', marcaSchema);