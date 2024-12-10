import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";


const Rol_Permisos = sequelize.define('rol_permisos',{
    role_id:{
        type: DataTypes.INTEGER,
        primaryKey:true,     
        references:{
            model:'roles',
            key:'id_rol'
            },
    },
    permiso_id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        references:{
            model:'permisos',
            key:'id '
    }
},

},{
    timestamps: false
})






export default Rol_Permisos;