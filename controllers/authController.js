import userModel from "../models/userModel.js";
import {hash,compare} from 'bcrypt';
import { randomBytes } from "crypto";
import tokenService from '../services/tokenService.js'
import userHistoryLogin from "../models/userHistoryModel.js";
//import tokenModel from '../models/tokenModel.js'
import refreshToken from "../models/refreshToken.js";
import Role from "../models/rolesModel.js";

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

}
 export default authController

