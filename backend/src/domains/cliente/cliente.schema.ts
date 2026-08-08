import { z } from 'zod';

export const clienteSchema = z.object({
  tipo_doc: z.enum(['DNI', 'CE', 'RUC']),
  num_doc: z.string().min(1).max(20),
  nombres: z.string().min(1).max(100),
  ap_paterno: z.string().min(1).max(50),
  ap_materno: z.string().max(50).optional(),
  email: z.string().email().optional().or(z.literal('')),
  telefono: z.string().max(20).optional(),
  fecha_nac: z.string().optional().nullable(),
});

export const clienteUpdateSchema = clienteSchema.partial();

export const clienteQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().transform(Number).default('10'),
  offset: z.string().transform(Number).default('0'),
});