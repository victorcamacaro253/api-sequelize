import { Router } from "express";
import rolesPermisosController from "../controllers/rolesPermisosControllers.js";
const router = Router()

router.get('/permisosByRole/:id',rolesPermisosController.getPermisosByRole)

router.get('/PermisosRoles',rolesPermisosController.listaPermisosRoles)

router.get('/roles/', rolesPermisosController.getRoles);   
router.get('/roles/rol/:rol',rolesPermisosController.getRoleByName) 
router.get('/roles/:id', rolesPermisosController.getRoleById);

router.post('/roles/', rolesPermisosController.createRole);
router.put('/roles/:id', rolesPermisosController.updateRole);
router.delete('/roles/:id', rolesPermisosController.deleteRole);



router.get('/permisos',rolesPermisosController.getPermisos)

router.get('/permisos/permiso',rolesPermisosController.getPermisosByName)

router.get('/permisos/:id',rolesPermisosController.getPermisosById)



router.post('/permisos/', rolesPermisosController.createPermiso); // para crear un nuevo
router.put('/:id', rolesPermisosController.updatePermiso); // para actualizar un existente
router.delete('/:id', rolesPermisosController.deletePermiso); // para eliminar un exist





 export  default router;
