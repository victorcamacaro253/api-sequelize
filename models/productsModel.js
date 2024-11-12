import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import Categorias from "./categoriasModel.js";
import Proveedor from "./proveedoresModel.js";

const Products = sequelize.define('productos',{
    id_producto :{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement:true
    },
    codigo:{
        type: DataTypes.STRING(250),
        allowNull:true
    },
    nombre_producto:{
        type: DataTypes.STRING(250),
        allowNull:false
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull:true
    },
    precio:{
        type:DataTypes.DECIMAL,
        allowNull:false
    },
    stock:{
        type:DataTypes.INTEGER, 
        allowNull:false
    },
    vendido: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    id_categoria:{
        type:DataTypes.INTEGER,
        references:{
            model:'categorias',
            key:'id'
        },
        allowNull:false
    },
    activo:{
        type:DataTypes.STRING(250),
        allowNull:false
    },
    id_proveedor :{
        type: DataTypes.INTEGER,
        references:{
            model:'proveedor',
            key:'id_proveedor'
            },
    },
    imagen:{
        type:DataTypes.STRING(250),
        allowNull:true
    }
},{
    tableName: 'productos',
    timestamps: false,

},
)


Products.belongsTo(Categorias,{foreignKey:'id_categoria',as: 'categoria'})
Products.belongsTo(Proveedor,{foreignKey:'id_proveedor',as : 'proveedor'})
export default Products