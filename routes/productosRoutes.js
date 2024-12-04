import { Router } from 'express'
import productController from "../controllers/productController.js"
import authenticateToken from "../middleware/authenticationToken.js"
import upload from '../middleware/multerConfig.js'

const router = Router()




router.get('/',productController.getProducts)

router.get('/categoria/',productController.getProductsByCategoria)

router.get('/price',productController.getProductsByPrinceRange)

//Ruta para obtener los productos filtrado por nombre
router.get('/name',productController.getProductByName)


router.post('/addMultipleProducts',upload.array('image'),productController.addMultipleProducts)

router.get('/meta', productController.getProductsMeta);

router.get('/filter',productController.filterProduct)

router.get('/topSelling',productController.getTopSelling)


//------------------------------------------------------------------
router.get('/salesByDate', productController.getProductsSoldByDateRange);


//------------------------------------------------------------------

router.get('/:id',productController.getProductsById)


router.post('/',upload.single('image'),productController.addProduct);

router.post('/deleteMultipleProducts',productController.deleteMultipleProducts)

router.post('/import',upload.single('file'),productController.importProducts)

router.delete('/:id',productController.deleteProduct)


export default router ;