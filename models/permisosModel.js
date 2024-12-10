import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import Rol_Permisos from "./rolesPermisosModel.js";


const Permisos= sequelize.define('permisos',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    permiso:{
        type: DataTypes.STRING(150),
        allowNull: false
    }
},{
    timestamps:false
})




export default Permisos;