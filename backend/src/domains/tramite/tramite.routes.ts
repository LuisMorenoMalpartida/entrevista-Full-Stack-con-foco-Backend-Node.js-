import { Router, type Router as RouterType } from 'express';
import { TramiteController } from './tramite.controller.js';
import seguimientoRoutes from './seguimiento/seguimiento.routes.js';
import { validate } from '../../middlewares/validate.js';
import { z } from 'zod';
import { 
  tramiteSchema, 
  tramiteUpdateSchema,
  tramiteQuerySchema,
  cambiarEstadoSchema 
} from './tramite.schema.js';

const router: RouterType = Router();
const controller = new TramiteController();

router.use('/:id/seguimientos', seguimientoRoutes);

router.get(
  '/',
  validate(z.object({ query: tramiteQuerySchema })),
  controller.listar.bind(controller)
);

router.get('/:id', controller.obtener.bind(controller));

router.post(
  '/',
  validate(z.object({ body: tramiteSchema })),
  controller.crear.bind(controller)
);

router.put(
  '/:id',
  validate(z.object({ body: tramiteUpdateSchema })),
  controller.editar.bind(controller)
);

router.post(
  '/:id/cambiar-estado',
  validate(z.object({
    body: cambiarEstadoSchema,
  })),
  controller.cambiarEstado.bind(controller)
);

router.delete('/:id', controller.eliminar.bind(controller));

export default router;
