import {Router} from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productsRoutes.js";
import comprasRoutes from "./comprasRoutes.js";
import noticationsRoutes from "./notificationsRoutes.js";
import cookieParser from "cookie-parser";
import csrf from '../middleware/csrfToken.js'
import routeNotFound from "../middleware/routeNotFound.js";


const router = Router();




router.use(cookieParser())

router.get('/csrftoken',csrf.setCsrfToken)

router.use('/users',userRoutes)

router.use('/auth',authRoutes)

router.use('/products',productRoutes)

router.use('/compras',csrf.csrfMiddleware,comprasRoutes)

router.use('/notificaciones',noticationsRoutes)


router.use(routeNotFound);



export default router;