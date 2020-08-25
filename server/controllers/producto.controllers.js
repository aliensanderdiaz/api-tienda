

let Producto = require('../models/producto.model');
let Categoria = require('../models/categoria.model');
let Marca = require('../models/marca.model');
let Hermandad = require('../models/hermandad.model');

let tokenSiigo;

const CATEGORIAS_COCINA_Y_MESA_GLOBAL = [
    "5b9c9f8e4e8f84362c77dbce",
    "5d0081afb716490587dc798a",
    "5bb292cbc214051450d3bbc8",
    "5cba814462f65623a477a2bf",
    "5bb2970cc214051450d3bbcb",
    "5cd13318de55cc2b345c69ed",
    "5cd13341de55cc2b345c69ee",
    "5d5cd105dd51b379baed8bad",
    "5bb019070f50942f28a35119",
    "5cd1357bde55cc2b345c69f1",
    "5cc3105646892122404f4391",
    "5caa6cdb7f77cf1bd015e9c3",
    "5bb28cfec214051450d3bbc2",
    "5ba968319299a031cced5fdf",
    "5bb28b38c214051450d3bbc1",
    "5cd1341ade55cc2b345c69ef",
    "5d373c4990aa1a0851f6f866",
    "5cd1035357c77f0b3cff879d",
    "5bb2895ac214051450d3bbc0",
    "5bb010f00f50942f28a35113",
    "5caa7e536e4f5a2174528ff8",
    "5d670e8d853fbe08f53f9f3b",
    "5ca16f93134e1033ccb7c75a"
];

const GRUPOS_ADMITIDOS = [795, 1418, 1419];
// 1	Electrodomésticos       795
// 2	Reparaciones
// 3	Cocina y Mesa           1418
// 4	Repuestos               1419

const ordenado = {
    precioMenor: 'precioEfectivoEnTienda',
    precioMayor: '-precioEfectivoEnTienda',
    ascendente: 'nombre',
    descendente: '-nombre',
    popularidad: '-popularidad',
    alfabetico: 'nombreTienda',
}

const slugify = function (palabra) {
    const chars = {
        "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n"
    };

    const palabraSlugify = palabra
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[áéíóúñ]/g, e => chars[e])

    return palabraSlugify;
}

const slugifyUpperCase = function (palabra) {
    const chars = {
        "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n"
    };

    const palabraSlugify = palabra
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[áéíóúñ]/g, e => chars[e])
        .toUpperCase()

    return palabraSlugify;
}

const sleep = function (ms) {
    console.log(`sleep ${ms}`)
    return new Promise(resolve => setTimeout(resolve, ms));
}

const obtenerGrupoDeInventario = function (etiqueta, categoriaIdString) {
    if (etiqueta === 'Repuesto') {
        return 1419
    } else if (producto.etiqueta === 'Producto') {
        if (CATEGORIAS_COCINA_Y_MESA.includes(categoriaIdString)) {
            return 1418
        } else {
            return 795
        }
    }
}

exports.productosCategoria = function (req, res, next) {
    const QUERY = req.query;

    const names = Object.keys(QUERY);
    const namesFiltrados = names.filter(name => name.startsWith('DETALLES'))
    const QUERYDETALLES = [];
    namesindetalles = namesFiltrados.map(name => name = name.slice(8))
    namesFiltrados.forEach((name, indice) => {
        QUERYDETALLES.push([namesindetalles[indice], QUERY[name].split(',')])
    })


    const ordenPor = ordenado[req.query.ordenPor] || 'precioEfectivoEnTienda';
    const pagina = +req.query.pagina || 1;
    const productosPorPagina = +req.query.productosPorPagina || 12;
    const desde = (pagina - 1) * productosPorPagina;

    console.log(`Productos Ordenados por ${ordenPor}, CategoriaId: ${req.params.categoriaId}`);

    Categoria
        .find()
        .where({ parent: req.params.categoriaId })
        .where('nombre').ne('Repuestos y Accesorios')
        .select('nombre parent')
        .exec((err, categorias) => {
            if (err) {
                console.log({ err, msg: 'Categoria.find'})
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            let ARRAY_CATEGORIAS = categorias.map(categoria => categoria._id);

            if (ARRAY_CATEGORIAS.length === 0) {
                ARRAY_CATEGORIAS = [req.params.categoriaId];
            }

            let query = Producto
                // .find({ etiqueta: 'Producto', mostrar: true, State: 1 });
                .find({ etiqueta: 'Producto', mostrarEnTienda: true });

            // if (QUERYDETALLES.length > 0) {
            console.log({ QUERYDETALLES: JSON.stringify(QUERYDETALLES) });
            QUERYDETALLES.forEach(q => {

                query.where('detalles.' + q[0]).in(q[1])
            })
            // }

            // .find({ etiqueta: 'Producto' })
            query
                .where('categoria').in(ARRAY_CATEGORIAS)
                .select('nombre caracteristicas.precio pictures Description Code nombreTienda precioEfectivoEnTienda precioTarjetaEnTienda plu marca')
                .populate({
                    path: 'marca',
                    select: 'nombre'
                })
                .limit(productosPorPagina)
                .skip(desde)
                .sort(ordenPor)
                .exec((err, productos) => {
                    if (err) {
                        console.log({ err, msg: 'producto.find'})
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    let queryConteo = Producto
                        .where({ etiqueta: 'Producto', mostrarEnTienda: true });
                    QUERYDETALLES.forEach(q => queryConteo.where('detalles.' + q[0]).in(q[1]))

                    queryConteo
                        // .where({ etiqueta: 'Producto' })
                        .where('categoria').in(ARRAY_CATEGORIAS).countDocuments({}, (err, conteo) => {

                            productos.forEach(producto => {
                                if (!producto.pictures || !producto.pictures.medium || producto.pictures.medium.length === 0) {
                                    producto.pictures = false;
                                } else {
                                    producto.pictures = true;
                                }
                            })

                            res.json({
                                ok: true,
                                productos,
                                total: conteo
                            });
                        })


                })

        })

}

exports.productosDisponiblesEnTienda = function (req, res, next) {


    Producto.find({ disponibleEnTienda: true }).exec(
        (err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productos
            })
        }
    )
}
exports.productosMostrarEnTienda = function (req, res, next) {


    Producto.find({ mostrarEnTienda: true }).exec(
        (err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productos
            })
        }
    )
}

exports.obtenerProductoPorPLU = function (req, res, next) {
    console.log({ plu: req.params.plu });
    Producto
        .findOne({ plu: req.params.plu })
        .populate('categoria_padre')
        .populate('categoria')
        .populate('hermanos')
        .populate('repuestos')
        .populate('accesorios')
        .populate('combo')
        .populate('marca')
        .populate({
            path: 'hermandad',
            populate: { path: 'productos.producto', select: 'nombre caracteristicas.referencia caracteristicas.modelo nombreTienda plu disponibleEnTienda mostrarEnTienda pictures' }
        })
        // .populate('hermandad')
        // .populate('hermandad.productos')
        // .populate('hermandad.productos.nombre')
        // .populate({ path: 'hermandad.productos.producto', select: 'nombre' })
        // .populate({ path: 'cmmf.proveedor', select: 'primerNombre razonSocial' })
        .exec((err, productoDB) => {
            if (err) {
                console.log({ err, msg: 'Error'})
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                console.log({ msg: 'No Producto'})
                return res.status(404).json({
                    ok: false,
                    err: 'No se encuentra el producto'
                });
            }

            // if (!productoDB.disponibleEnTienda || !productoDB.mostrarEnTienda) {
            if (!productoDB.disponibleEnTienda) {
                console.log({ msg: 'No Disponible'})
                return res.status(404).json({
                    ok: false,
                    err: 'Producto Inactivo'
                });
            }

            console.log({
                producto: productoDB
            })

            res.json({
                ok: true,
                producto: productoDB
            });
        })
}