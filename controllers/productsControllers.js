import Products from "../models/productsModel.js";
import Categorias from "../models/categoriasModel.js";
import Proveedor from "../models/proveedoresModel.js";
import sequelize from "../db/db.js";
import {randomBytes} from 'crypto';
import { json, where } from "sequelize";
import {Op} from "sequelize";
import fs from 'fs'
import csvParser from "csv-parser";

class productsController{

//--------------------------------------------------------------------------------------------------------------------------------
//Funcion para obtener todos los productos
static getProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      include: [
        {
          model: Categorias,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: Proveedor,
          as: 'proveedor',
          attributes: ['id_proveedor', 'nombre', 'direccion']
        }
      ],
      attributes: ['id_producto', 'codigo', 'nombre_producto', 'descripcion', 'precio', 'stock', 'vendido', 'id_categoria', 'activo', 'id_proveedor', 'imagen']
    })
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------------
//Funcion para obtener un producto por id


static getProductById= async (req,res)=>{
    const {id} = req.params;
   
    if(!id || isNaN(id)) return res.status(400).json({message: 'id is required'});
   
       
   
    
   
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


        // Si no se encuentra el producto, retornar un error 404
        if (!result) {
          return res.status(404).json({ message: `Product with id ${id} not found` });
      }

   
       res.json(result)
   
       
    } catch (error) {
       console.error('error',error)
       res.status(500).json({message:'Error fetching product'})
   
    }
   
    
   }

//------------------------------------------------------------------------------------------------------------------------------------
// Funcion para obtener todos los productos por su nombre de producto

 static getProductByName =async (req,res)=>{
  const {name} = req.query;

  // Validación del parámetro 'name'
  if (!name || typeof name !== 'string' ) {
    return res.status(400).json({ message: 'Please provide a valid product name' });
}

  try {

    const product = await Products.findAll({
      where: {
        nombre_producto: {
          [Op.like]: `%${name.trim()}%` // Usar LIKE para buscar nombres similares
        }
        
      },
      include: [
        {
          model: Categorias,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion'],
          },
          {
            model: Proveedor,
            as: 'proveedor',
            attributes: ['id_proveedor', 'nombre', 'direccion'],
            }
            ] 
            })

              // Verificar si se encontró el producto
        if (!product) {
          return res.status(404).json({ message: `Product with name '${name}' not found` });
      }
            
            res.json(product)
    
  } catch (error) {
    console.error('error',error)
    res.status(500).json({message:'Error fetching Products'})
    
  }
 }


//------------------------------------------------------------------------------------------------------------------------------------
// Funcion para insertar multiples productos

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
    console.log('imagen',imagePath)
  
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
  
        const codigo = randomBytes(4).toString('hex').toUpperCase();
  
        // Verificar si el producto ya existe
        const existingProduct = await Products.findOne({
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
          imagen: imagePath || ''
        });
      }
  
      // Llamar a bulkCreate para insertar múltiples productos
      if (productsToInsert.length > 0) {
        await Products.bulkCreate(productsToInsert, { transaction });
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

//-----------------------------------------------------------------------------------------------------------------------------------
// Función para eliminar un  producto

  static deleteProduct = async (req, res) => {
    const { id } = req.params;
 
 try {

  const productExist = await Products.findOne({where:{id_producto:id}})
  if (!productExist) {
    return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const deleteProduct= await Products.destroy({
      where: { id_producto:id },
      
    })

    res.json({message:`${deleteProduct} usuarios eliminados correctamente`})
  
 } catch (error) {
  console.error('Error ejecutando la consulta:', error);
  return res.status(500).json({ error: 'Error interno del servidor' });
  
 }


}

//---------------------------------------------------------------------------------------------------------
// Función para actualizar un producto

static updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre_producto,descripcion,precio,stock,vendido,id_categoria,activo,id_proveedor} = req.body;
  try {
  

      const productExist = await Products.findByPk(id)

      if(!productExist){
        return res.status(404).json({message:'Producto no encontrado'})
      }
        
      const updatedData = {};

     
    if (nombre_producto) updatedData.nombre_producto = nombre_producto;
    if (descripcion) updatedData.descripcion = descripcion;
    if (precio) updatedData.precio = precio;
    if (stock) updatedData.stock = stock;
    if (vendido) updatedData.vendido = vendido;
    if (id_categoria) updatedData.id_categoria = id_categoria;
    if (activo !== undefined) updatedData.activo = activo;  // Asegúrate de verificar valores booleanos
    if (id_proveedor) updatedData.id_proveedor = id_proveedor;
                  
                 await Products.update(updatedData,{where:{id_producto:id}})
                 
                 res.json({message:'Producto actualizado correctamente'})

        } catch (error) {
          console.error('Error ejecutando la consulta:', error);
          return res.status(500).json({ error: 'Error interno del servidor' });
          }


          };


//-------------------------------------------------------------------------------------------------------------------------
// Función para obtener productos por su rango de precio


          static getProdcutsByPriceRange = async (req,res)=>{
           const {min,max} = req.query

           if(isNaN(min) || isNaN(max)){
            return res.status(400).json({message:'Rango de precio invalido'})
           }

           try {
            
            const products = await Products.findAll({
              where:{
                precio:{
                  [Op.between]:[parseFloat(min),parseFloat(max)]
                }
              }
            })


     res.json(products)


           } catch (error) {
            return res.status(500).json({message:'Error del servidor'})
           }

          }


          static getTopSelling = async (req,res)=>{
           try {
            const topSelling = await Products.findAll({
              order: [['ventas', 'DESC']],
              limit: 5
              })
              res.json(topSelling)
            
           } catch (error) {
            return res.status(500).json({message:'Error del servidor'})
           }
          }


//--------------------------------------------------------------------------------------------------------------------------------------
/*
 static getProductsSoldByDateRange = async(req,res)=>{
  const {startDate,endDate} = req.query

 if (!startDate || !endDate) {
  return res.status(400).json({ message: 'Se requieren startDate y endDate' });
}
    try {
      const products = await Products.findAll({
        where:{
          fecha:
          {[Op.between]:[startDate,endDate]}
          }
          })
          res.json(products)

 }catch(error){
  return res.status(500).json({message:'Error del servidor'})
 }


}
 */

//-----------------------------------------------------------------------------------------------------------------------------

 static importProducts = async (req,res)=>{
const filePath= req.file.path
const products =[]


  try {
    const readStream= fs.createReadStream(filePath)
    const parseStream= readStream.pipe(csvParser())

    parseStream.on('data',(row)=>{
 products.push({
  codigo : row.codigo,
  nombre_producto: row.nombre_producto,
  descripcion: row.descripcion,
  precio: parseFloat(row.precio),
  stock: parseInt(row.stock),
  id_categoria: parseInt(row.id_categoria),
  activo:row.activo,
  id_proveedor:parseInt(row.id_proveedor),
  imagen:row.imagen

 })
    })

    await new Promise ((resolve,reject)=>{
      parseStream.on('end',resolve),
      parseStream.on('error',reject)
    })

    const count = await Products.bulkCreate(products)

    fs.unlinkSync(filePath)

    return res.json({message:'Productos Importados exitosamente',count})
    
  } catch (error) {
       // Limpiar el archivo en caso de error
       if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    return res.status(500).json({message:'Error del servidor'})
    }
    
  }   

  static async  actualizarProductosMasVendidos(id_producto, cantidad_vendida) {
    try {
      // Buscar el producto en la base de datos
      const producto = await Products.findByPk(id_producto);
  
      if (!producto) {
        throw new Error(`Producto con ID ${id_producto} no encontrado`);
      }
  
      // Actualizar la cantidad de productos vendidos
      await producto.update({
        productos_vendidos: producto.productos_vendidos + cantidad_vendida
      });
  
      console.log(`Productos vendidos actualizados para el producto ID: ${id_producto}`);
    } catch (error) {
      console.error('Error actualizando productos más vendidos:', error);
    }
  }

//-----------------------------------------------------------------------------------------------------------------------------


  static async getProductsByCategoria(req, res) {
    try {
      const { categoria } = req.params;
  
      // Validar que el parámetro 'categoria' sea válido
      if (!categoria) {
        return res.status(400).json({ error: 'La categoría es obligatoria' });
      }
  
      // Obtener el id_categoria correspondiente al nombre de la categoría
      const categoriaData = await Categorias.findOne({
        where: { categoria } // Suponiendo que el campo 'categoria' es el nombre
      });
  
      if (!categoriaData) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
  
      const id_categoria = categoriaData.id_categoria;
  
      // Buscar los productos que pertenecen a la categoría encontrada
      const products = await Products.findAll({
        where: {
          id_categoria  // Filtrar por el id de la categoría
        },
        include: [
          {
            model: Categorias,
            as: 'categoria',
            attributes: ['id_categoria', 'categoria', 'descripcion']
          },
          {
            model: Proveedor,
            as: 'proveedor',
            attributes: ['id_proveedor', 'nombre', 'direccion']
          }
        ],
        attributes: ['id_producto', 'codigo', 'nombre_producto', 'descripcion', 'precio', 'stock', 'vendido', 'id_categoria', 'activo', 'id_proveedor', 'imagen']
      });
  
      // Si no se encuentran productos, devolver un mensaje adecuado
      if (products.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos para esta categoría' });
      }
  
      // Responder con los productos encontrados
      res.json(products);
    } catch (error) {
      // Capturar y manejar cualquier error
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al obtener los productos' });
    }
  }

  //--------------------------------------------------------------------------------------------------------------------------------------

static getAvailableProducts= async(req,res)=>{
  
 try {
  
  const products= await Products.findAll({
    attributes:['id_producto','nombre_producto','stock'],
    where: {
      stock:{
        [Op.gt]:0
      }
    }
  })


  const total_productos_disponibles = products.length
const totalStock = products.reduce((acc,product)=>acc + product.stock,0)


  res.json({
    products,
    total_productos_disponibles,
    totalStock
  })

}catch(error){
  console.error(error)
  res.status(500).json({error:'Hubo un error al obtener los productos disponibles'})

}
  
  
}

}



export default productsController;