import sequelize from "../db/db.js"
import { DataTypes } from "sequelize"
import userModel from '../models/userModel.js'

const userHistoryLogin = sequelize.define('historial_ingresos',{

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario:{
        type: DataTypes.INTEGER,  // Cambié a INTEGER, ya que se trata de una clave foránea
        allowNull: false,
        references: {
          model: userModel, // Asegúrate de que esté correctamente importado
          key: 'id'  // La columna que hace referencia al ID del usuario
        }
      
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP') // Usa el timestamp de la base de datos
    },
    codigo:{
        type: DataTypes.STRING(250)
    }},{
        tableName: 'historial_ingresos',
        timestamps: false,  // Desactiva los campos createdAt y updatedAt
      
} )

// Relación: Un historial de ingreso pertenece a un usuario
userHistoryLogin.belongsTo(userModel, { foreignKey: 'id_usuario', as: 'user' });
export default userHistoryLogin