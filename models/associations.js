// associations.js
import Compras from './comprasModel.js';
import productosCompras from './productosCompraModel.js';
import user from './userModel.js';
import Products from './productsModel.js';

// Establecer las asociaciones
Compras.hasMany(productosCompras, { foreignKey: 'id_compra' });
Compras.belongsTo(user, { foreignKey: 'id_usuario' });

productosCompras.belongsTo(Compras, { foreignKey: 'id_compra' });
productosCompras.belongsTo(Products, { foreignKey: 'id_producto' });
//productosCompras.belongsTo(user, { foreignKey: 'id_usuario' });