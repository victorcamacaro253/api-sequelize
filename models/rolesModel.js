import sequelize from "../db/db.js"
import { DataTypes } from "sequelize"


const Role = sequelize.define('roles', {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rol: {
      type: DataTypes.STRING(250),
      allowNull: false  
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      created_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Valor por defecto
  allowNull: false,
  field: 'created_at' // This will map it to `created_at` in the database
      }
  }, {
    tableName: 'roles',
    timestamps: false
  });


  

  export default Role
  