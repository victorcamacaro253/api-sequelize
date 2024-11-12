import {Router} from "express";
import productsController from "../controllers/productsControllers.js";


const router=  Router()


router.get('/',productsController.getProducts)

router.get('/:id',productsController.getProductById)


export default router