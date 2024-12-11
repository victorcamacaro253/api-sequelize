import {Router} from 'express'
import Import from '../controllers/importController.js'
import upload from '../middleware/multer.js'


const router = Router()

router.post('/users/csv',upload.single('file'),Import.importUsers)

router.post('/users/Excel',upload.single('file'),Import.importUsersExcel)

export default router;