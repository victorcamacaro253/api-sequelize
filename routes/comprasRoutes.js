import { Router } from "express";
import comprasController from "../controllers/comprasController.js";

const router = Router()


router.get('/',comprasController.getCompras)

export default router
