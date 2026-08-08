import { Router, type Router as RouterType } from 'express';
import { ClienteController } from './cliente.controller.js';
import { validate } from '../../middlewares/validate.js';
import { clienteSchema, clienteUpdateSchema, clienteQuerySchema } from './cliente.schema.js';
import { z } from 'zod';

const router: RouterType = Router();
const controller = new ClienteController();

// GET /api/clientes - Listar clientes
router.get(
  '/',
  validate(z.object({ query: clienteQuerySchema })),
  controller.listar.bind(controller)
);

// GET /api/clientes/:id - Obtener cliente
router.get('/:id', controller.obtener.bind(controller));

// POST /api/clientes - Crear cliente
router.post(
  '/',
  validate(z.object({ body: clienteSchema })),
  controller.crear.bind(controller)
);

// PUT /api/clientes/:id - Editar cliente
router.put(
  '/:id',
  validate(z.object({ body: clienteUpdateSchema })),
  controller.editar.bind(controller)
);

export default router;