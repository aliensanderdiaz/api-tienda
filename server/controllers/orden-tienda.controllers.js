let OrdenTienda = require('../models/orden-tienda.model');
let Producto = require('../models/producto.model');

exports.crearOrdenTienda = async function (req, res, next) {

    try {
        
        let orden = req.body;
        let productos = orden.productos;
    
        let carrito = [];
        let total = 0;
    
        console.log({ orden });
    
    
        for (const producto of productos) {
            let productoDB = await Producto
                .findOne({ _id: producto._id })
                .select('precioEfectivoEnTienda precioTarjetaEnTienda');
    
            let itemCarrito;
    
            if (orden.metodoPago === 'Efectivo') {
                itemCarrito = {
                    producto: producto._id,
                    qty: producto.qty,
                    unitPrice: productoDB.precioEfectivoEnTienda,
                    totalPrice: producto.qty * productoDB.precioEfectivoEnTienda
                };
            } else {
                itemCarrito = {
                    producto: producto._id,
                    qty: producto.qty,
                    unitPrice: productoDB.precioTarjetaEnTienda,
                    totalPrice: producto.qty * productoDB.precioTarjetaEnTienda
                };
            }
    
            total += itemCarrito.totalPrice;
            carrito.push(itemCarrito);
            
        }
        
        let subtotal = Math.trunc(total / 1.19);
        let iva = total - subtotal;
    
        let ordenComprobada = new OrdenTienda({
            cedula: orden.cedula,
            telefono: orden.telefono,
            primerNombre: orden.primerNombre,
            segundoNombre: orden.segundoNombre,
            apellidos: orden.apellidos,
            correoElectronico: orden.correoElectronico,
            direccion1: orden.direccion,
            direccion2: orden.direccionDatos,
            facturarAEmpresa: orden.facturarAEmpresa,
            razonSocial: orden.razonSocial,
            nit: orden.nit,
            metodoPago: orden.metodoPago,
            total: total,
            subtotal: subtotal,
            iva: iva,
            carrito: carrito,
            estado: 'CREADA'
        });
    
        let ordenCreada = await ordenComprobada.save();
    
        res.json({
            ok: true,
            orden: ordenCreada
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }


}


exports.obtenerOrdenesTienda = function (req, res, next) {
    OrdenTienda
        .find()
        .populate('carrito.producto', 'nombreTienda plu caracteristicas.referencia')
        .exec(
            (err, ordenes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    ordenes
                })
            }
        )
}

exports.obtenerOrdenTienda = function (req, res, next) {
    OrdenTienda
        .findById(req.params.id)
        .populate('carrito.producto', 'nombreTienda plu caracteristicas.referencia')
        .exec(
            (err, orden) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    orden
                })
            }
        )
}