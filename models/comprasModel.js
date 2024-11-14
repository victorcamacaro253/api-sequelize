import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import user from "./userModel.js";

const Compras = sequelize.define('compras',{
    id_compra:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario:{
        type:DataTypes.INTEGER,
        references:{
            model:'usuario',
            key:'id'
        },
        allowNull:false
    },
    total_compra:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    fecha:{
        type: DataTypes.DATEONLY,
        allowNull:false
    }
},{
    tableName:'compras',
    timestamps:false
})


Compras.belongsTo(user,{foreignKey:'id_usuario',as: 'user' })

export default Compras