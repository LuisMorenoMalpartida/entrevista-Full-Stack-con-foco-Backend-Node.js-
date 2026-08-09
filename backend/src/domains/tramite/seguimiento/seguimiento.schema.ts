import { z } from 'zod';

export const seguimientoSchema = z.object({
  tramite_id: z.number().positive(),
  estado_anterior: z.enum(['REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO']).optional().nullable(),
  estado_nuevo: z.enum(['REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO']),
  comentario: z.string().optional(),
  usuario: z.string().default('operador'),
});

export const cambiarEstadoSchema = z.object({
  nuevoEstado: z.enum(['REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO']),
  comentario: z.string().optional(),
});
