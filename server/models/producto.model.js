var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombreTienda: { type: String },
    precioEfectivoEnTienda: { type: Number },
    popularidad: { type: Number },
    precioTarjetaEnTienda: { type: Number },
    disponibleEnTienda: { type: Boolean },
    mostrarEnTienda: { type: Boolean },
    siigoId: { type: Number },
    plu: { type: Number },
    siigoRef: { type: String, maxlength: 80 },
    tipo: { type: String },
    nombrePos: { type: String },
    etiqueta: { type: String, required: [true, 'La etiqueta es necesaria'], enum: ['Producto', 'Repuesto', 'Combo'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nombre_corto: { type: String },
    slug: { type: String, required: [true, 'El slug es necesario'] },
    mostrar: { type: Boolean, default: false },
    comprado: { type: Boolean, default: false },
    enInventario: { type: Boolean, default: true },
    marca: {
        type: Schema.ObjectId,
        ref: 'Marca'
    },
    grupo_de_inventario: {
        type: Schema.ObjectId,
        ref: 'GrupoDeInventario'
    },
    impuesto: {
        type: Schema.ObjectId,
        ref: 'Impuesto'
    },
    precio: {
        type: Schema.ObjectId,
        ref: 'Precio'
    },
    inventario: {
        type: Schema.ObjectId,
        ref: 'Inventario'
    },
    categoria: {
        type: Schema.ObjectId,
        ref: 'Categoria'
    },
    categoria_padre: {
        type: Schema.ObjectId,
        ref: 'Categoria'
    },
    hermandad: {
        type: Schema.ObjectId,
        ref: 'Hermandad'
    },
    hermanos: [{
        type: Schema.ObjectId,
        ref: 'Producto'
    }],
    combo: [{
        type: Schema.ObjectId,
        ref: 'Producto'
    }],
    caracteristicas: {
        modelo: String,
        precio: Number,
        existencias: Number,
        color: String,
        referencia: { type: String, unique: true },
        garantia: String,
        codigo_de_barras: String,
        ean13: String,
        ean14: String
    },
    detalles: Schema.Types.Mixed,
    repuestos: [{
        type: Schema.ObjectId,
        ref: 'Producto'
    }],
    accesorios: [{
        type: Schema.ObjectId,
        ref: 'Producto'
    }],
    pictures: {
        pp: Number,
        large: [String],
        medium: [String],
        small: [String],
    },
    cmmf: [{
        _id: false,
        proveedor: {
            type: Schema.ObjectId,
            ref: 'Usuario'
        },
        codigo: String
    }],
    videos: [String],
    descripcion: [{
        _id: false,
        alineacion: String,
        texto: String,
        imagen: String
    }],
    historico: [{
        _id: false,
        cantidad: Number,
        fecha: Date,
        precio: Number,
        compra: {
            type: Schema.ObjectId,
            ref: 'Compra'
        },
        venta: {
            type: Schema.ObjectId,
            ref: 'Venta'
        },
        tipo: {
            type: String,
            enum: ['Compra', 'Venta', 'Inventario']
        }
    }],
    // siigo
    datosSiigo: Schema.Types.Mixed,
    Code: String,
    Description: String,
    AccountGroupID: Number,
    ReferenceManufactures: String,
    CodeBars: String,
    State: Number,
});

productoSchema.pre('save', function (next) {

    if (this.isNew) {
        console.log('pre')
        var product = this;

        console.log('Function pre save')

        if (product.pictures.medium.length == 0) {
            console.log('Function Pictures')
            for (const picture of product.pictures.large) {
                const url2 = picture.split('?')[0];
                const urlThumbnail = url2.split('%2F')[0] + '%2Fthumb%40100_' + url2.split('%2F')[1];
                const urlThumbnail2 = url2.split('%2F')[0] + '%2Fthumb%40300_' + url2.split('%2F')[1];


                product.pictures.small.push(urlThumbnail + '?alt=media');
                product.pictures.medium.push(urlThumbnail2 + '?alt=media');
            }
        }
    }

    next();
})

module.exports = mongoose.model('Producto', productoSchema);