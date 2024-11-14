import {Router} from "express";
import productsController from "../controllers/productsControllers.js";
import upload from "../middleware/multer.js";

const router=  Router()


router.get('/',productsController.getProducts)

router.get('/name',productsController.getProductByName)

router.get('/price',productsController.getProdcutsByPriceRange)

router.get('/topSelling',productsController.getTopSelling)

//router.get('/salesByDate', productsController.getProductsSoldByDateRange);


router.post('/import',upload.single('file'),productsController.importProducts)

router.get('/:id',productsController.getProductById)



router.post('/addMultipleProducts',upload.array('image'),productsController.addMultipleProducts)


router.delete('/:id',productsController.deleteProduct)


export default router