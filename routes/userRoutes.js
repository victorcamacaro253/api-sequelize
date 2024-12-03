import { Router } from "express"
import userController from "../controllers/userController.js"
import upload from "../middleware/multer.js"
const router = Router()



router.get('/',userController.getAllUsers)


router.get('/name',userController.getUserByName)


router.get('/loginHistorial/:id',userController.getLoginHistory)

router.get('/:id',userController.getUserById)

router.post('/',userController.addUser)

router.post('/login', userController.login);

router.put('/',userController.updateUser)

router.delete('/:id',userController.deleteUsers)

router.post('/multiple',userController.deleteMultipleUsers)

router.post('/import',upload.single('file'),userController.importUsers)

export default router