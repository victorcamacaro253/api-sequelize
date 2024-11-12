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



static addMultipleProducts = async (req, res) => {
    // Convierte los productos de string a objeto
    let products;
    try {
      products = JSON.parse(req.body.products || '[]');
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON format for products' });
    }
  
    const imagePath = req.files && req.files.length > 0 ? `/uploads/${req.files[0].filename}` : null;
    
    console.log(products);
  
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }
  
    const errors = [];
    const createdProducts = [];
    
    // Iniciar una transacción con Sequelize
    const transaction = await sequelize.transaction();
  
    try {
      const productsToInsert = [];
      
      for (const product of products) {
        const { 
          nombre_producto,
          descripcion,
          precio,
          stock,
          id_categoria,
          activo = 'activo',
          id_proveedor
        } = product;
  
        // Validaciones manuales (asegurándose de que los campos estén presentes)
        if (!nombre_producto || !descripcion || !precio || !stock || !id_categoria) {
          errors.push({ error: 'nombre_producto, descripcion, precio, stock y id_categoria son requeridos' });
          continue;
        }
  
        // Validar que el precio y stock sean válidos
        const precioNum = parseFloat(precio);
        const stockNum = parseInt(stock, 10);
  
        if (isNaN(precioNum) || precioNum < 0) {
          errors.push({ error: 'El precio debe ser un número positivo' });
          continue;
        }
  
        if (isNaN(stockNum) || stockNum < 0) {
          errors.push({ error: 'El stock debe ser un número entero positivo' });
          continue;
        }
  
        const codigo = crypto.randomBytes(4).toString('hex').toUpperCase();
  
        // Verificar si el producto ya existe
        const existingProduct = await ProductModel.findOne({
          where: { nombre_producto },
          transaction // Asegúrate de que la consulta esté dentro de la transacción
        });
  
        if (existingProduct) {
          errors.push({ error: 'El producto ya existe', nombre_producto });
          continue;
        }
  
        // Preparar el producto para la inserción
        productsToInsert.push({
          codigo,
          nombre_producto,
          descripcion,
          precio: precioNum,
          stock: stockNum,
          id_categoria,
          activo,
          id_proveedor,
          imagePath: imagePath || ''
        });
      }
  
      // Llamar a bulkCreate para insertar múltiples productos
      if (productsToInsert.length > 0) {
        await ProductModel.bulkCreate(productsToInsert, { transaction });
      }
  
      // Confirmar la transacción
      await transaction.commit();
  
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      } else {
        // Si todo va bien, devolver los productos creados
        return res.status(201).json({ createdProducts });
      }
  
    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      // En caso de error, deshacer la transacción
      await transaction.rollback();
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };



}


export default productsController;