import { Router } from "express";
import notificationsController from "../controllers/notificationsController.js";
const router = Router();


router.get('/',notificationsController.getNotifications)

 router.get('/:id',notificationsController.getNotificationById)

 router.post('/',notificationsController.createNotification)

 router.delete('/:id',notificationsController.deleteNotification)

 router.put('/:id',notificationsController.updateNotification)


export default router;