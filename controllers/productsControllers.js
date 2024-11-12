import Products from "../models/productsModel.js";
import Categorias from "../models/categoriasModel.js";
import Proveedor from "../models/proveedoresModel.js";
class productsController{


static getProducts= async (req,res)=>{
    try {
        const products = await Products.findAll({
             include:[ {
            model: Categorias,   // Include the 'Role' model
            as: 'categoria',    // Alias we defined in the association
            attributes: ['id_categoria', 'categoria', 'descripcion']  // List of columns you want to retrieve from the roles table
          },
          {
            model: Proveedor,
            as: 'proveedor',
            attributes: ['id_proveedor', 'nombre', 'direccion'],

          }
        ]
        })
        res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
            }

}




static getProductById= async (req,res)=>{
    const {id} = req.params;
   
    if(!id){
   
       
       return  res.status(400).json({message:'Please provide a valid product id'})
   
    }
   
    try {
   
       const  result = await Products.findOne({
           where: { id_producto: id },  // You can filter by user ID
           include:[ {
            model: Categorias,   // Include the 'Role' model
            as: 'categoria',    // Alias we defined in the association
            attributes: ['id_categoria', 'categoria', 'descripcion']  // List of columns you want to retrieve from the roles table
          },
          {
            model: Proveedor,
            as: 'proveedor',
            attributes: ['id_proveedor', 'nombre', 'direccion'],

          }
        ]
           })
   
       res.json(result)
   
       
    } catch (error) {
       console.error('error',error)
       res.status(500).json({message:'Error fetching user'})
   
    }
   
    
   }



}


export default productsController;