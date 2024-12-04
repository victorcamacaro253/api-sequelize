import { Router } from 'express'
import usersRoutes from './userRoutes.js'
import productRoutes from  './productosRoutes.js'
import comprasRoutes from  './comprasRoutes.js'
import notificationRoutes  from  './notificationsRoutes.js'
import notificationUserRoutes   from  './notificationUserRoutes.js'
import exportRoutes  from  './exportRoutes.js'
import cookieParser from 'cookie-parser';
import csrf from '../middleware/csrfToken.js';
import rolesPermisosRoutes from  './rolesPermisosRoutes.js'
import authRoutes from './authRoutes.js'
import routeNotFound from '../middleware/routeNotFound.js'
//const csrfProtection = csrf({cookie:true})





const router= Router();


router.use(cookieParser());

router.get('/csrftoken',csrf.setCsrfToken)



router.use('/users',usersRoutes)

router.use('/auth',authRoutes)

router.use('/products',productRoutes)

router.use('/compras',csrf.csrfMiddleware,comprasRoutes);


router.use('/notifications',notificationRoutes)

router.use('/userNotification',notificationUserRoutes)

router.use('/export',exportRoutes)
 
router.use('/rolesPermisos',rolesPermisosRoutes)

router.use(routeNotFound);

export default router