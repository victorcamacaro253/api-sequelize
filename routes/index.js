import {Router} from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productsRoutes.js";
import comprasRoutes from "./comprasRoutes.js";
import noticationsRoutes from "./notificationsRoutes.js";
import csrf  from "csurf";
import cookieParser from "cookie-parser";


const router = Router();

const csrfProtection = csrf({cookie:true})


router.use(cookieParser())

router.use('/users',userRoutes)

router.use('/auth',authRoutes)

router.use('/products',productRoutes)

router.use('/compras',comprasRoutes)

router.use('/notificaciones',noticationsRoutes)
export default router;