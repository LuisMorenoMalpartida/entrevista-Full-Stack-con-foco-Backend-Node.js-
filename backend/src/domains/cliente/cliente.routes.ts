import { Router, type Router as RouterType } from 'express';
import { ClienteController } from './cliente.controller.js';
import { validate } from '../../middlewares/validate.js';
import { z } from 'zod';
import { clienteSchema, clienteUpdateSchema, clienteQuerySchema } from './cliente.schema.js';

const router: RouterType = Router();
const controller = new ClienteController();

router.get(
  '/',
  validate(z.object({ query: clienteQuerySchema })),
  controller.listar.bind(controller)
);

router.get('/:id', controller.obtener.bind(controller));

router.post(
  '/',
  validate(z.object({ body: clienteSchema })),
  controller.crear.bind(controller)
);

router.put(
  '/:id',
  validate(z.object({ body: clienteUpdateSchema })),
  controller.editar.bind(controller)
);

export default router;
