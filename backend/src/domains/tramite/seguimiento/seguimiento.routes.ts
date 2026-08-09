import { Router, type Router as RouterType } from 'express';
import { SeguimientoController } from './seguimiento.controller.js';

const router: RouterType = Router();
const controller = new SeguimientoController();

router.get('/:tramiteId/seguimientos', controller.listar.bind(controller));

export default router;
