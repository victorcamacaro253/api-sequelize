import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Categorias = sequelize.define('categorias',{
    id_categoria:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    categoria:{
        type:DataTypes.STRING(250)

    },
    descripcion:{
        type:DataTypes.STRING(500)

    }
},{
    tableName: 'categorias',
    timestamps: false,

},)

export default Categorias;