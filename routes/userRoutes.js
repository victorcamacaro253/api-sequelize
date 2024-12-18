import { Router } from "express"
import userController from "../controllers/userController.js"
import upload from "../middleware/multer.js"
import authenticateToken from "../middleware/authenticationToken.js"
const router = Router()



router.get('/',authenticateToken,userController.getAllUsers)


router.get('/name',userController.getUserByName)

router.get('/pagination',userController.getUsersWithPagination)


router.get('/loginHistorial/:id',userController.getLoginHistory)

router.get('/:id',userController.getUserById)

router.post('/',userController.addUser)

router.post('/login', userController.login);

router.put('/',userController.updateUser)

router.put('/status/:id/:status',userController.changeStatus)

router.delete('/:id',userController.deleteUsers)

router.post('/multiple',userController.deleteMultipleUsers)



export default router