import { Router } from "express"
import userController from "../controllers/userController.js"

const router = Router()



router.get('/users',userController.getAllUsers)

router.get('/users/:id',userController.getUserById)

router.post('/users',userController.addUser)

router.put('/users',userController.updateUser)

router.delete('/users/:id',userController.deleteUsers)

router.post('/users/multiple',userController.deleteMultipleUsers)

export default router