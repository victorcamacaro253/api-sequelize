import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";


const Notificaciones = sequelize.define('notificaciones',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
        
    },
    message:{
        type:DataTypes.STRING(250),
    },
    type:{
        type:DataTypes.STRING(250),
        
    },
   
})


export default Notificaciones