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
   const {message,type} = req.body

      try {

     const notificaciones = await Notificaciones.create({message,type})

     console.log(notificaciones)
        res.json(notificaciones)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error al crear notificación' })
            }


}

static async deleteNotification(req,res){
    const {id}= req.params
    try {
        const notificaciones = await Notificaciones.destroy({where:{id:id}})
        
        if (!notificaciones) {
            return res.status(404).json({ message: 'Notificación no encontrada' })
            }

            res.json({message:'Notificación eliminada con exito'})

            } catch (error) {
                console.log(error)
                return res.status(500).json({ message: 'Error al eliminar notificación' })
                }
               
}


static async updateNotification(req,res){
    const {id}= req.params
    const {message,type}= req.body
    try {
        const notificaciones = await Notificaciones.update({message,type},{where:{id:id}})
        if(!notificaciones){
            return res.status(404).json({message:'Notificación no encontrada'})
        }   
        
        res.json(notificaciones)
        }catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error al actualizar notificación' })
            }

        }
}



export default notificationsController