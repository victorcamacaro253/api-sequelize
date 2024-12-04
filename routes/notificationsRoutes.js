import { Router } from 'express'
import notificationsController from '../controllers/notificationsController.js';

const router = Router();

//Ruta para obtener notificaciones

router.get('/',notificationsController.getNotifications);

//Ruta para crear una notificacion

router.post('/',notificationsController.createNotification); 

//Ruta para actualizar una notificacion

router.put('/:id',notificationsController.updateNotification);

//Router para eliminar una notiificacion
router.delete('/:id',notificationsController.deleteNotification);


export default router;
