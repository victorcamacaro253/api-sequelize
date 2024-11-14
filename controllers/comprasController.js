import Compras from '../models/comprasModel.js'

class comprasController{


static getCompras= async (req, res) => {
    try {
        const compras = await Compras.findAll()
        res.json(compras)
        } catch (error) {
            res.status(500).json({ message: error.message })
            }
            }
            




}

export default comprasController