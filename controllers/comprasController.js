import Compras from '../models/comprasModel.js'
import user from '../models/userModel.js'
import Products from '../models/productsModel.js'
import productosCompras from '../models/productosCompraModel.js'

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
                        



}

export default comprasController