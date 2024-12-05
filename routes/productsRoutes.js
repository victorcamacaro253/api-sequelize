import {Router} from "express";
import productsController from "../controllers/productsControllers.js";
import upload from "../middleware/multer.js";

const router=  Router()


router.get('/',productsController.getProducts)

router.get('/name',productsController.getProductByName)

router.get('/price',productsController.getProdcutsByPriceRange)

router.get('/topSelling',productsController.getTopSelling)


router.get('/availability',productsController.getAvailableProducts)

//router.get('/salesByDate', productsController.getProductsSoldByDateRange);
router.get('/categoria/:categoria',productsController.getProductsByCategoria)


router.post('/import',upload.single('file'),productsController.importProducts)

router.get('/:id',productsController.getProductById)

router.put('/:id',productsController.updateProduct)


router.post('/addMultipleProducts',upload.array('image'),productsController.addMultipleProducts)


router.delete('/:id',productsController.deleteProduct)


export default router