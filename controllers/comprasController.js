import Compras from '../models/comprasModel.js'
import user from '../models/userModel.js'
import Products from '../models/productsModel.js'
import productosCompras from '../models/productosCompraModel.js'
import sequelize from "../db/db.js";
import {Op} from "sequelize";
import productsController from './productsControllers.js';

class comprasController{


static getCompras= async (req, res) => {
    try {
        const compras = await Compras.findAll({
            
        include:[
            {
                model: user,
                
                attributes:['id','nombre','apellido','correo']
            }, {
                model: productosCompras, // Obtener los productos comprados en esta compra
               
                
                include: [
                  {
                    model: Products, // Obtener los detalles de los productos
                    
                    attributes: ['id_producto', 'nombre_producto', 'precio']
                  }
                ]
              }
        ]

        })
        res.json(compras)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
            }
            }
            
            static getComprasById = async (req, res) => {
              try {
                const {id} = req.params
                const compras = await Compras.findByPk(id, {
                  include: [
                    {
                      model: user,
                      attributes:['id','nombre','apellido','correo']
                      },
                      {
                        model: productosCompras, // Obtener los productos comprados en esta compra
                        include: [
                          {
                            model: Products, // Obtener los detalles de los productos
                            attributes: ['id_producto', 'nombre_producto', 'precio']
                            }
                            ]
                            }
                            ]
                            })
                            res.json(compras)
                            } catch (error) {
                              console.log(error)
                              res.status(500).json({ message: error.message })
                              }
                            }

            static getComprasByUserId= async (req, res) => {
                const {id} = req.params
                try {
                    const compras = await Compras.findAll({
                        where: { id_usuario: id },
                    include:[
                        {
                            model: user,
                            
                            attributes:['id','nombre','apellido','correo']
                        }, {
                            model: productosCompras, // Obtener los productos comprados en esta compra
                           
                            
                            include: [
                              {
                                model: Products, // Obtener los detalles de los productos
                                
                                attributes: ['id_producto', 'nombre_producto', 'precio']
                              }
                            ]
                          }
                    ]
            
                    })
                    res.json(compras)
                    } catch (error) {
                        console.log(error)
                        res.status(500).json({ message: error.message })

                        }

                        }
                        


                        static compraProduct= async (req, res) => {
                          const { id_usuario,productos} = req.body

                          if (!id_usuario || !productos || !Array.isArray(productos) || productos.length === 0) {
                            return res.status(400).json({ error: 'El usuario y al menos un producto son requeridos' });
                          }

                          let totalCompra= 0;

                          for(const producto of productos){
                            const {id_producto,cantidad,precio} = producto;
                            if (!id_producto || !cantidad || !precio || isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio <= 0) {
                              return res.status(400).json({ error: 'Datos de producto inválidos' });
                            }
                            totalCompra += cantidad * precio;   
                          }

                          const transaccion= await sequelize.transaction();

                          try {
                            const insertProductos=[];
                            for(const producto of productos){
                              const {id_producto,cantidad,precio} = producto;
                              const stock = await Products.findByPk(id_producto,{transaction: transaccion})

                              if (!stock) {
                                await transaccion.rollback()
                                return res.status(404).json({ error: `Producto con ${id_producto} no encontrado` });
                                
                              }


                              if ( stock.stock < cantidad) {
                                await transaccion.rollback()
                                return res.status(400).json({ error: `No hay suficiente stock para el producto para el producto con el id ${id_producto}`})
                              }
                              insertProductos.push({id_producto,cantidad,precio})
                            } 
                          
                            // Crear una nueva instancia de la fecha actual
                            let fechaActual = new Date();

                           // Formatear la fecha a formato MySQL (YYYY-MM-DD HH:MM:SS)
                          let fechaFormateada = fechaActual.toISOString().slice(0, 19).replace('T', ' ');

                            //Se crea la compra 

                          const compra = await Compras.create({
                            id_usuario, 
                            total_compra: totalCompra,
                          fecha: fechaFormateada},
                             {transaction: transaccion})
                            

                          //Insertar productos
                          const compraProductosPromises = insertProductos.map(async(producto)=>{
                            return await productosCompras.create({
                              id_compra: compra.id_compra,
                              id_producto: producto.id_producto,
                              cantidad: producto.cantidad,
                              precio: producto.precio
                            },{transaction:transaccion})
                          })

                          await Promise.all(compraProductosPromises);



                           const updateStockPromises = insertProductos.map(async (producto)=>{
                            const stock = await Products.findByPk(producto.id_producto,{transaction: transaccion})
                            const newStock = stock.stock - producto.cantidad


                            await Products.update({stock:newStock},  { where: { id_producto: producto.id_producto }, transaction: transaccion })
                           })

                           await Promise.all(updateStockPromises);

                           await transaccion.commit()

                              for (const producto of productos) {
                                const {id_producto,cantidad,precio} = producto
                                await productsController.actualizarProductosMasVendidos(id_producto,cantidad)
                              }


                              return res.status(200).json({message: "Compra realizada con exito"})
                              } catch (error) {
                                await transaccion.rollback()
                                console.log(error)
                                return res.status(500).json({error: "Error al realizar la compra"})
                                }

                        


                        }

}

export default comprasController