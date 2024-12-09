import Permisos from "../models/permisosModel.js";
import Role from "../models/rolesModel.js";
//import Permisos from "../models/permisosModel.js";
import Rol_Permisos from "../models/rolesPermisosModel.js";



class rolesPermisosController{

    static getRoles = async (req, res) => {
        try {
            
            const roles = await Role.findAll()
console.log(roles)
            res.json(roles)

        } catch (error) {
            return res.status(500).json({message:'Error interno del servidor'})
        }
    }


    static getRoleByName = async (req, res) => {
        const {rol} = req.params

        try {
            const role = await Role.findOne({where:{rol}})
            console.log(role)
            if(!role){
                return res.status(404).json({message:'Rol no encontrado'})
                }
                res.json(role)
            
        } catch (error) {
            return res.status(500).json({message:'Error interno del servidor'})
        }
    }

    

 static  getRoleById= async (req,res)=>{
    const {id} = req.params
    try{
        
        const rol =  await Role.findByPk(id)
        console.log(rol)
        if (!rol){
            return res.status(404).json({message: 'Rol no encontrado'})
            }


        res.json(rol)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al obtener los roles'})
            
        }


        }

        
  static   createRole= async (req,res)=>{
    try{
        const {rol,descripcion} = req.body
console.log(rol,descripcion)
   const exisitngRole= await Role.findOne({where:{rol}})
  

   if (exisitngRole) {
    return res.status(400).json({message: 'Rol ya existe'})

    
   }

          await Role.create({rol,descripcion})

    


        res.status(201).json({message:"Rol creado exitosamente"})
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al crear el rol'})


        }

}
static updateRole = async (req, res) => {
    const { id } = req.params;
    const { rol, description } = req.body;

    try {
        // Busca el rol por ID
        const existingRole = await Role.findByPk(id);
        if (!existingRole) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        // Actualiza solo los campos que se proporcionan
        const updatedFields = {};
        if (rol) {
            updatedFields.rol = rol;
        }
        if (description) {
            updatedFields.description = description;
        }

        // Actualiza el rol en la base de datos
        await existingRole.update(updatedFields);

        res.json({ message: "Rol actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
}

static deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        // Busca el rol por ID
        const existingRole = await Role.findByPk(id);
        if (!existingRole) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        // Elimina el rol
        await existingRole.destroy();

        res.json({ message: "Rol eliminado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el rol' });
    }
}



static getPermisos = async (req,res)=>{
    try{
        const permisos =  await Permisos.findAll()
        res.json(permisos)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al obtener los permisos'})
            }

 }



 static getPermisosById=  async (req,res)=>{
    const {id}=  req.params
    try{
        const permisos =  await Permisos.findByPk(id)
        if(permisos.length===0){
            res.status(404).json({message: 'No se encontraron permisos para el rol'})

        }
        res.json(permisos)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al obtener los permisos del rol'})
                }
                
                }


                static getPermisosByName=   async (req,res)=>{
                    const {name}=  req.query
                    try{
                        const permisos =  await Permisos.findAll({where:{permiso:name}})
                        if(permisos.length===0){
                            res.status(404).json({message: 'No se encontraron permisos con ese nombre'})
                                }



                                res.status(200).json(permisos)
                                }catch(error){
                                    console.log(error)
                                    res.status(500).json({message: 'Error al obtener el permiso con ese nombre'})
                                    }
                                    



                                    }
                                    

static createPermiso= async (req,res)=>{
const {permiso}= req.body
try{

   const exisitingPermiso = await Permisos.findOne({where:{permiso}})

   if (exisitingPermiso) {
    return res.status(400).json({ message: 'El permiso ya existe' })
    
   }

    const result = await Permisos.create({permiso})
    res.json(result)
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Error al crear el permiso'})
        }

}


static updatePermiso = async (req,res)=>{
const {id}= req.params
const {name}= req.body
try {


    const existingPermiso = await Permisos.findByPk(id);
    if (!existingPermiso) {
        return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    const updatedFields={}

    if (name) {
        updatedFields.permiso= nombre
        
    }


    const permiso = await Permisos.update(updatedFields)
    res.json(permiso)
    
    
} catch (error) {
    console.log(error)
    res.status(500).json({message: 'Error al actualizar el permiso'})
    
}
}


static deletePermiso  = async (req,res)=>{
const {id}= req.params
try{
    const permiso = await rolesPermisosModel.deletePermiso(id)
    if(permiso.length===0){
        res.json({message: 'El permiso no existe'})
    }
    res.json(permiso)
}catch(error){
    console.log(error)
    res.status(500).json({message: 'Error al eliminar el permiso'})
}
}


static getPermisosByRole= async (req,res)=>{
    const {id}= req.params
    try{
        const permiso = await Permisos.findAll({
            include:[{
                model: Rol_Permisos,
                where:{role_id:id},
                attributes:[]
            }],
            attributes:['id','permiso']
        })


         permiso= results.map(result => result.permiso);

        res.json(permiso)

        }catch(error){

            console.log(error)
            res.status(500).json({message: 'Error al obtener los permisos del rol'})

            
        }

            }



}



export default rolesPermisosController