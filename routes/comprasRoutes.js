import { Router } from "express";
import comprasController from "../controllers/comprasController.js";

const router = Router()

//Ruta para obtener  todas las compras

router.get('/',comprasController.getCompras)


//Ruta para obtener  las compras de Id de usuario 

router.get('/user/:id',comprasController.getComprasByUserId)

//Ruta para obtener  las compras de Id 

router.get('/:id',comprasController.getComprasById)

//Ruta para agregar una compra

router.post('/',comprasController.compraProduct)

export default router
