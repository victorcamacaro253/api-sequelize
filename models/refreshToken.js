
import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const refreshToken = sequelize.define("refreshToken", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuario',  // Table name of the referenced model
            key: 'id'
        },
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    expiresIn: {
        type: DataTypes.DATE,
        allowNull: false
    },
    revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'refresh_tokens',
    timestamps: true,  // Automatically manages `createdAt` and `updatedAt`
    createdAt: 'createdAt',  // Sequelize default column name for creation time
    updatedAt: 'updatedAt'   // Sequelize default column name for update time
});

export default refreshToken;
