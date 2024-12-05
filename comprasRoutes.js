import { Router } from "express";
import comprasController from "../controllers/comprasController.js";

const router = Router()

//Ruta para obtener  todas las compras

router.get('/',comprasController.getCompras)

//Ruta para  obtener las compras por usuario

router.get('/user/:username',comprasController.getComprasByUsername)

//Ruta para botener las compras dentro de un rango de fecha
router.get('/fecha',comprasController.getComprasRangoFecha)

//Ruta para obtener  las compras de Id de usuario 

router.get('/user/:id',comprasController.getComprasByUserId)

//Ruta para  obtener las compras de un usuario por un rango de fecha

router.get('/:id/fecha',comprasController.getComprasUsuarioRangoFechas )

//Ruta para obtener  las compras de Id 

router.get('/:id',comprasController.getComprasById)

//Ruta para agregar una compra

router.post('/',comprasController.compraProduct)

//Ruta para eliminar una compra

router.delete('/:id',comprasController.deleteCompra)



export default router
