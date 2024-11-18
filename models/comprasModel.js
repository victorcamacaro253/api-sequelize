import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";



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






export default Compras