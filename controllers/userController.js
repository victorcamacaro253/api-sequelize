import userModel from '../models/userModel.js'
import { hash } from 'bcrypt';


class userController {


static getAllUsers= async (req,res)=>{

try {
    
    const result = await  userModel.user.findAll();
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

    const  result = await userModel.user.findByPk(id)

    res.json(result)

    
 } catch (error) {
    console.error('error',error)
    res.status(500).json({message:'Error fetching user'})

 }
}





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


  const  userExists = await userModel.user.findOne({where:{cedula}})
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

const result = await userModel.user.bulkCreate(usersToInsert)

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
        
 const result = await userModel.user.findByPk(id)

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
        const user = await userModel.user.findByPk(id);
        
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
const deleteMultipleUsers = await  userModel.user.destroy({
    where:{
        id:ids
    }

})

if(deleteMultipleUsers === 0){
    return res.status(404).json({message:'No users found to delete'})
}

res.json({message:`${deleteMultipleUsers} usuarios eliminados correctamente`})


    
} catch (error) {
    console.error('errorr')
    res.status(500).json({error:'error interno del serivdor',error})
}

}




}
export default userController