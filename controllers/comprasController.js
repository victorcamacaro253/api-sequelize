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


 //-----------------------------------------------------------------------------------------------------------------------------------           
            
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


//-------------------------------------------------------------------------------------------------------------------------------------


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
                      
    //-------------------------------------------------------------------------------------------------------------------------------------

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


                            await Products.update({stock:newStock}, 
                               { where: { id_producto: producto.id_producto },
                                transaction: transaccion })
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



//-----------------------------------------------------------------------------------------------------------------------------------------------
 
 static getComprasRangoFecha = async (req,res)=>{
  const {inicio,fin} = req.query

   // Validar si las fechas son válidas
   if (!inicio || !fin) {
    return res.status(400).json({ error: "Las fechas de inicio y fin son requeridas." });
  }
   // Formatear las fechas (asegúrate de que el formato sea el correcto según tu base de datos)
   const formattedInicio = new Date(inicio);
   const formattedFin = new Date(fin);

  try {
    const compras = await Compras.findAll({where:{
      fecha:{
        [Op.between]:[formattedInicio,formattedFin ]
      }
    },
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
    ]})

      // Verificar si se encontraron compras
      if (!compras || compras.length === 0) {
        return res.status(404).json({ error: "No se encontraron compras en el rango de fechas proporcionado." });
      }

    res.json(compras)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({error: "Error al obtener las compras "})
    
  }
 }


 //--------------------------------------------------------------------------------------------------------------------------------

 static getComprasUsuarioRangoFechas  = async (req,res)=>{
 const {id} = req.params;
 const {inicio,fin} = req.query;



 const userData = await user.findByPk(id);

 if (!userData || userData.length === 0) {
  return res.status(404).json({ error: "El usuario no existe." });
  
 }


 const formattedInicio = new Date(inicio);
 const formattedFin = new Date(fin);

 console.log(formattedFin,formattedInicio)
 try {
  const compras = await Compras.findAll({where:
    {
      [Op.and]:
      [
        {id_usuario: id},
        {fecha: {[Op.between]: [formattedInicio, formattedFin]}},
        ],
        },  include:[
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


if(!compras || compras.length === 0){
  return res.status(404).json({error: "No se encontraron compras en elrango de fechas proporcionado."})
    }
    res.json(compras)


 }catch(error){
  console.log(error)
  return res.status(500).json({error: "Error al obtener las compras "})
 }

}


 static getComprasByUsername = async (req, res) => {
    const { username } = req.params;

    const nombre= username

    try {
      const userData = await user.findOne({where: {nombre}})

      if(!userData || userData.length === 0){
        return res.status(404).json({error: "No se encontró el usuario con el"})
      }
      const compras = await Compras.findAll({
        where: {
          id_usuario: userData.id
          }, include:[
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
      return res.status(500).json({error: "Error al obtener las compras "})
    }

 }

 static deleteCompra = async (req, res) => {
  const {id} = req.params
  
  const transaccion = await sequelize.transaction()
  
  try {
  
    const compra = await Compras.findByPk(id,{ transaction: transaccion})

    if(!compra){
      await transaccion.rollback()
      return res.status(404).json({error: "compra no encontrada"})
    }

    const productosComprados= await productosCompras.findAll({
      where:{id_compra:id},
      transaction:transaccion 
    })

    const updateProductosComprados = productosComprados.map(async (producto)=>{
      const productoEncontrado = await Products.findByPk(producto.id_producto, {transaction:transaccion})


      if(productoEncontrado){
    const nuevoStock= productoEncontrado.stock + producto.cantidad;
    await Products.update({stock:nuevoStock},
      {where:{id_producto:productoEncontrado.id_producto},
      transaction:transaccion
    })
    
      }

    })

  await Promise.all(updateProductosComprados)

  //Eliminar los productos de la compra
  await productosCompras.destroy({
    where: {id_compra:id},
    transaction: transaccion
  })

  //Eliminamos la compra
  await compra.destroy({transaction:transaccion})

  await transaccion.commit()

  return res.json({message:"Compra eliminada con exito"})

  } catch (error) {
    await transaccion.rollback(); // Rollback en caso de error
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar la compra" });
  }

 }


}

export default comprasController