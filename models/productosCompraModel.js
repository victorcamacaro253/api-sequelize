import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";



const productosCompras = sequelize.define("productos_compras", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        id_compra: {
            type: DataTypes.INTEGER,
            references: {
                model: 'compras',
                key: "id_compra"
                }
              },
        id_producto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'productos',
                key: "id_producto"
                }
                },
                cantidad :{
                    type: DataTypes.INTEGER
                    
                },
                precio:{
                    type: DataTypes.DECIMAL(10,2)

                }
              
                    }, {
  tableName: 'productos_compras',
  timestamps: false
});




export default  productosCompras;
