import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticationToken.js';
import upload from '../middleware/multerConfig.js';
import checkPermission from '../middleware/checkPermission.js';

//Ruta para obtener los datos de la base de datos

router.get('/',userController.getAllUser);

router.get('/searchUser',userController.searchUsers);

router.get('/getperfil',authenticateToken,checkPermission('read'),userController.getPerfil)

router.get('/loginHistorial',userController.getLoginHistory)

router.get('/getUserPerfil/:id',userController.getUserPerfil)

router.get('/pagination',userController.getUsersWithPagination)

//Ruta para agregar un nuevo usuario

router.post('/',userController.addUser);

router.post('/login', userController.loginUser);

router.get('/:id',userController.getUserById);


router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);


router.patch('/:id', userController.partialUpdateUser)


router.post('/addMultipleUsers',upload.array('image'),userController.addMultipleUsers)


router.post('/deleteMultipleUsers',userController.deleteMultipleUsers)

router.post('/requestPasswordReset',userController.requestPasswordReset)

router.post('/resetPassword/:token',userController.resetPassword)




export default router;