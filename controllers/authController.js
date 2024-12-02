import userModel from "../models/userModel.js";
import {hash,compare} from 'bcrypt';
import { randomBytes } from "crypto";
import tokenService from '../services/tokenService.js'
import userHistoryLogin from "../models/userHistoryModel.js";
//import tokenModel from '../models/tokenModel.js'
import refreshToken from "../models/refreshToken.js";
import Role from "../models/rolesModel.js";
import { decode } from "punycode";

class authController{
static loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({
      where: { correo: email },
      include: {
        model: Role,
        as: 'role',
        attributes: ['id_rol', 'rol', 'descripcion', 'created_at']
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await compare(password, user.contraseña);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = tokenService.generateToken(user.id, user.correo, user.rol, '1h');
    const refreshTokenl = tokenService.generateToken(user.id, user.correo, user.rol, '7d');

    const expiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    

    await refreshToken.create({
      id_usuario: user.id,
      token: refreshTokenl,
     
      expiresIn,
      revoked: 'FALSE'
    });

    res.cookie('refreshToken', refreshTokenl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const code = randomBytes(8).toString('hex');
    await userHistoryLogin.create({ id_usuario: user.id, codigo: code });

    return res.json({
      token,
      user: {
        id: user.id,
        correo: user.correo,
        nombre: user.nombre
      },
      refreshTokenl
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


static logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    console.log(token)

   if(!token){
    return res.status(401).json({ message: 'No se encontró el refresh token'})
   }


   const decoded = tokenService.verifyToken(token)

   console.log(decoded)

   if(!decoded){
    return res.status(401).json({ message: 'El refresh token es inválido o expiro'})
   }

    const tokenEntry= await refreshToken.findOne({
      where: {
        token: token,
        id_usuario: decoded,
        revoked:false ,}
    })   

if(!tokenEntry){
  return res.status(401).json({ message: 'El token no se ha encontrado'})
}


    tokenEntry.revoked=true
     await tokenEntry.save()

      // Eliminar la cookie del refresh token
  res.clearCookie('refreshToken', {
    httpOnly: true,  // Asegura que la cookie no pueda ser accesible por JavaScript
    secure: process.env.NODE_ENV === 'production',  // Solo en producción si usas HTTPS
    sameSite: 'Strict',  // Protege contra ataques CSRF
});

          return res.json({ message: 'Sesión cerrada correctamente' });
          } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor' });
            }


          
   }


 static refreshToken = async (req, res) => {
  const token= req.cookies.refreshToken;
console.log(token)
  if(!token){
    return res.status(401).json({ message: 'No se encontró el refresh token'})
  }

  try {
    const decoded= tokenService.verifyToken(token)
  console.log(decoded)
    if(!decoded){
      return res.status(401).json({ message: 'El refresh token es inválido o expiro'})
    }

    const user = await userModel.findOne({
      where:{id: decoded},
      
    })

   if(!user){
  return res.status(404).json({error:'Usuario No encontrado'})
   }

   //Verificar si el refreh token esta egistrado y  no ha sido revocado
 
   const tokenRecord= await refreshToken.findOne({
    where:{
      token:token, // Buscar por el valor del token
      id_usuario:decoded, //Asegúrate de buscar por el ID del usuario que hizo la petición

      revoked:0 //  // Asegúrate de que no esté revocado
    },    
   })

   if (!tokenRecord) {
    return res.status(403).json({ message: 'El refresh token no es valido o ha sido registrado'})
    
   }
    
   const newAccessToken=tokenService.generateToken(user.id,user.correo,user.rol,'1h')

   return res.json({accessToken: newAccessToken})


  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al generar el nuevo token' })
    
  }

 }

}
 export default authController

