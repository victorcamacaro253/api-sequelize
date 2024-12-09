import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import Role from "./rolesModel.js";
import Permisos from "./permisosModel.js";

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



Rol_Permisos.belongsTo(Role,{foreignKey:'id_rol',as: 'roles'})
Rol_Permisos.belongsTo(Permisos,{foreignKey:'id',as : 'permiso'})


export default Rol_Permisos;