import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Proveedor= sequelize.define('Proveedor',{
    id_proveedor: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    codigo: {
        type: DataTypes.STRING(250),
        allowNull: false
        
    },
    nombre: {
        type: DataTypes.STRING(250),
        allowNull: false
        },
        direccion: {
            type: DataTypes.STRING(100),
            allowNull: false
            },

},{
    tableName: 'proveedor',
    timestamps: false,

},)


export default Proveedor