import { Router, type Router as RouterType } from 'express';
import { TramiteController } from './tramite.controller.js';
import { validate } from '../../middlewares/validate.js';
import { 
  tramiteSchema, 
  tramiteUpdateSchema, 
  tramiteQuerySchema,
  cambiarEstadoSchema 
} from './tramite.schema.js';
import { z } from 'zod';

const router: RouterType = Router();
const controller = new TramiteController();

// GET /api/tramites - Listar trámites
router.get(
  '/',
  validate(z.object({ query: tramiteQuerySchema })),
  controller.listar.bind(controller)
);

// GET /api/tramites/:id - Obtener detalle de trámite
router.get('/:id', controller.obtener.bind(controller));

// POST /api/tramites - Crear trámite
router.post(
  '/',
  validate(z.object({ body: tramiteSchema })),
  controller.crear.bind(controller)
);

// PUT /api/tramites/:id - Editar trámite
router.put(
  '/:id',
  validate(z.object({ body: tramiteUpdateSchema })),
  controller.editar.bind(controller)
);

// POST /api/tramites/:id/cambiar-estado - Cambiar estado
router.post(
  '/:id/cambiar-estado',
  validate(z.object({
    body: cambiarEstadoSchema,
  })),
  controller.cambiarEstado.bind(controller)
);

// DELETE /api/tramites/:id - Eliminar trámite
router.delete('/:id', controller.eliminar.bind(controller));

export default router;