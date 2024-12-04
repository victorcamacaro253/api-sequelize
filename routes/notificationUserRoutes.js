import { Router } from "express";
import notificationsController from "../controllers/notificationsController.js";

const router= Router();

//Ruta para obtener las notificaciones por nombre de usuario
router.get('/',notificationsController.getUserNotification);


//Ruta para obtener las notificaciones por id
//router.get('/userNotification/:id',notificationsController.getUserNotificationById)

//Ruta para crear una notificacion para el usuarios
router.post('/',notificationsController.createUserNotification)



//Ruta para actualizar una notificacion de usuario
router.put('/:id',notificationsController.updateUserNotification);


//Router para eliminar una notificacion de usuario
router.delete('/:id',notificationsController.deleteUserNotification)

export default router;