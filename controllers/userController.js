import userModel from '../models/userModel.js'
import Role from '../models/rolesModel.js';
import { hash,compare } from 'bcrypt';
import tokenService from '../services/tokenService.js';
import {randomBytes} from 'crypto';
import userHistoryLogin from '../models/userHistoryModel.js'
import fs from 'fs'
import csvParser from "csv-parser"
import { parse } from 'path';
import { rejects } from 'assert';



class userController {

static getAllUsers= async (req,res)=>{

try {
    
    const result = await  userModel.findAll({
        include: {
            model: Role,   // Include the 'Role' model
            as: 'role',    // Alias we defined in the association
            attributes: ['id_rol', 'rol', 'descripcion', 'created_at']  // List of columns you want to retrieve from the roles table
          }
    });
    return  res.json(result);


} catch (error) {
    console.error('Error ',error)
    res.status(500).json({message:'Error fetching users'})
}



}


static getUserById= async (req,res)=>{
 const {id} = req.params;

 if(!id){

    
    return  res.status(400).json({message:'Please provide a valid user id'})

 }

 try {

    const  result = await userModel.findOne({
        where: { id: id },  // You can filter by user ID
        include: {
          model: Role,
          as: 'role',
          attributes: ['id_rol', 'rol', 'descripcion', 'created_at']
        }
        })

    res.json(result)

    
 } catch (error) {
    console.error('error',error)
    res.status(500).json({message:'Error fetching user'})

 }

 
}


static getUserByName= async (req,res)=>{
    const {name} = req.query;
   
    if(!name){
   
       
       return  res.status(400).json({message:'Please provide a valid user id'})
   
    }
   
    try {
   
       const  result = await userModel.findAll({
           where: { nombre: name },  // You can filter by user ID
           include: {
             model: Role,
             as: 'role',
             attributes: ['id_rol', 'rol', 'descripcion', 'created_at']
           }
           })

   
       res.json(result)
   
       
    } catch (error) {
       console.error('error',error)
       res.status(500).json({message:'Error fetching user'})
   
    }

}

//-------------------------------------------------------------------------------------------------------------------

static login = async(req,res)=>{
    const {email,password}=req.body;
    console.log(email,password)
    try {
        const user = await userModel.findOne(
            {where:{correo:email},
            include: {
                model: Role,
                as: 'role',
                attributes: ['id_rol', 'rol', 'descripcion', 'created_at']
              }});


       if(!user){
        return {error:'Usuario no encontrado'}
       }

      

       const isPasswordValid = await compare(password,user.contraseña)

       if(!isPasswordValid){
        return {error:'Contraseña Incorrecta'}
       }

const token = tokenService.generateToken(user.id,user.correo,user.rol)

const refreshToken= tokenService.generateToken(user.id,user.correo,user.rol)

  // Generar un código aleatorio
  const randomCode = randomBytes(8).toString('hex'); // Genera un código aleatorio de 8 caracteres
  console.log('codigo',randomCode)
  // Insertar registro de inicio de sesión en la base de datos
  await userHistoryLogin.create({ id_usuario: user.id,codigo: randomCode})

return res.json({
    token, 
    user: { 
      id: user.id, 
      nombre: user.nombre 
    }
  });
       

    } catch (error) {
        console.error('error',error)
        res.status(500).json({message:'Error fetching user'})
        
    }
}

//------------------------------------------------------------------------------------------------------------

static addUser  = async (req, res) => {

 const { users } = req.body

 console.log(users)


 if(!req.body || typeof req.body  !== 'object' || !Array.isArray(req.body.users)){
    return res.status(400).json({error:'users must be an array'}) 
}


const errors= [];

const createdUsers = [];


try {

    const usersToInsert= [];

    for(const user of users){
      
  const{
  nombre,
  apellido,
  cedula,
  correo,
  password

  }=user
    
  if(!nombre || !apellido || !correo || !password){
    return res.status(400).json({error:'data are required'})
  }

  if(password.length < 7){
    return res.status(400).json({error:'Password must be at least 7 digits'})
  }


  const  userExists = await userModel.findOne({where:{cedula}})
  console.log('Usuario encontrado:', userExists);
  
if(userExists){
    errors.push({error:'El usuario ya existe',nombre})
    continue
}

const contraseña = await hash (password,10);

usersToInsert.push({
    nombre,
    apellido,
    cedula,
    correo,
    contraseña
})



}

const result = await userModel.bulkCreate(usersToInsert)

createdUsers.push(...result);

return res.status(201).json({createdUsers,errors})
    
} catch (error) {
    console.error('Error al agregar usuarios', error);
    return res.status(500).json({ message: 'Error al agregar usuarios' });
}


}



 static deleteUsers = async (req,res)=>{
    const {id} = req.params

    try {
        
 const result = await userModel.findByPk(id)

 result.destroy()

 return res.json({message:'Usuario eliminado correctamente'})

    } catch (error) {
        console.error({error:'error'})
        return res.status(500).json({message:'Error al eliminar'})
    }
 }


 static updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, apellido, cedula, email, password } = req.body;

    try {
        // Buscar el usuario por ID
        const user = await userModel.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar solo los campos que se proporcionaron
        const updatedData = {};

        if (name) {
            updatedData.nombre = name;
        }
        if (apellido) {
            updatedData.apellido = apellido;
        }
        if (cedula) {
            updatedData.cedula = cedula;
        }
        if (email) {
            updatedData.correo = email;
        }
        if (password) {
            updatedData.contraseña = await hash(password, 10);
        }

        // Actualizar el usuario
        await user.update(updatedData);

        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar el usuario:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


static deleteMultipleUsers = async  (req, res) => {

const {ids}= req.body

if(!Array.isArray(ids)  || ids.length === 0) {
    return res.status(400).json({error:'IDs are required'})
    
    }


try {
const deleteMultipleUsers = await  userModel.destroy({
    where:{
        id:ids
    }

})

if(deleteMultipleUsers.length === 0){
    return res.status(404).json({message:'No users found to delete'})
}

res.json({message:`${deleteMultipleUsers} usuarios eliminados correctamente`})


    
} catch (error) {
    console.error('errorr')
    res.status(500).json({error:'error interno del serivdor',error})
}

}

//-------------------------------------------------------------------------------------------------------------------
static getLoginHistory = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la URL
    
    try {
      // Buscar todos los registros del historial de inicio de sesión para un usuario específico
      const userHistory = await userHistoryLogin.findAll({
        where: { id_usuario: id }, // Filtrar por la clave foránea del usuario
        attributes: ['id', 'id_usuario', 'fecha', 'codigo'], // Seleccionar los campos que deseas de historial
        include: [
          {
            model: userModel, // Incluir el modelo de usuario
            as: 'user', // Nombre del alias de la relación en el modelo
            attributes: ['id', 'nombre', 'correo'], // Los campos del usuario que quieres incluir
          }
        ]
      });
      
      if (userHistory.length === 0) {
        return res.status(404).json({ message: 'No se encontró historial de inicio de sesión para este usuario' });
      }
  
      // Responder con el historial de inicio de sesión
      return res.json({
        userHistory: userHistory.map(record => ({
          id: record.dataValues.id,
          id_usuario: record.dataValues.id_usuario,
          fecha: record.dataValues.fecha,
          codigo: record.dataValues.codigo,
          user: {
            id: record.user.dataValues.id,
            nombre: record.user.dataValues.nombre,
            correo: record.user.dataValues.correo,
          }
        })),
      });
  
    } catch (error) {
      console.error('Error al obtener el historial de inicio de sesión:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error });
    }
  };
 
 //-----------------------------------------------------------------------------------------------------------------------------------------
 
 static getUsersWithPagination = async (req, res) => {
  try {
    // Obtener 'page' y 'limit' desde la URL
    let { page = 1, limit = 10 } = req.query;

    // Convertir a enteros
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Validar que 'page' y 'limit' sean números válidos
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Los parámetros "page" y "limit" deben ser números positivos válidos.' });
    }

    // Calcular el 'offset'
    const offset = (page - 1) * limit;

    // Buscar los usuarios con paginación
    const users = await userModel.findAll({
      limit: limit,  // Limitar la cantidad de registros
      offset: offset,  // Desplazamiento de registros
      attributes: ['id', 'nombre', 'correo'],  // Seleccionar solo ciertos campos
    });

    // Responder con los usuarios obtenidos
    res.json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error });
  }
}

//------------------------------------------------------------------------------------------------------------------------------------------
  
  static importUsers = async (req, res) => {
 const filePath= req.file.path;
 const users =[]

   try {
     const readStream= fs.createReadStream(filePath)
     const parseStream= readStream.pipe(csvParser())


     parseStream.on('data',(row)=>{
      const hashPassword = hash(row.contraseña,10)
      users.push({
        nombre : row.nombre,
        apellido: row.apellido,
        cedula: row.cedula,
        contraseña: hashPassword,
        rol: row.rol,
        imagen: row.imagen
      })
     })

     await new Promise ((resolve,reject)=>{
      parseStream.on('end',resolve),
      parseStream.on('error',reject)
     })

     const count = await userModel.bulkCreate(users)

     fs.unlinkSync(filePath)
     return res.json({message:'Usuarios importados Correctamente ',count})

   } catch (error) {
    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath)
    }
    console.error('Error al importar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error})
    
   }

  }



  //-----------------------------------------------------------------------------------------------------------------------------------

  static changeStatus= async (req,res)=>{
    const {id,status}= req.params
console.log(status,id)
    try {
    const user = await userModel.findByPk(id);
    if (!user) {
      return res.status(404).json({message:'Usuario no encontrado'})
    }
    user.estatus = status; // Update the status
    await user.save(); // Save the changes
    
    res.json({message:'Estatus del Usuario cambiado exitosamente'})
  } catch (error) {
    console.error('Error changing user status:', error);
    return res.status(500).json({message:'Error interno del servidor'})
  }

}
}
export default userController