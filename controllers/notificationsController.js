import Notificaciones from '../models/notificationsModel.js';

class notificationsController{

static async getNotifications(req, res) {
 try {
    const notificaciones = await Notificaciones.findAll()
if (!notificaciones) {
    return res.status(404).json({ message: 'No hay notificaciones' })

}

res.json(notificaciones)

 } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error al obtener notificaciones' })
 }

}

static async getNotificationById(req,res){
    const {id}= req.params
    try {
        const notificaciones = await Notificaciones.findByPk(id)
        if (!notificaciones) {
            return res.status(404).json({ message: 'Notificación no encontrada' })
            }
            res.json(notificaciones)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error al obtener notificación' }) 
    }
}

static async createNotification(req, res) {



}



}



export default notificationsController