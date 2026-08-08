import { z } from 'zod';

const estadoTramiteSchema = z.enum([
  'REGISTRADO',
  'EN_FIRMAS',
  'PRESENTADO',
  'OBSERVADO',
  'INSCRITO',
  'CERRADO',
  'ANULADO',
]);

const clienteSchema = z.object({
  tipo_doc: z.enum(['DNI', 'CE', 'RUC']),
  num_doc: z.string().min(1).max(20),
  nombres: z.string().min(1).max(100),
  ap_paterno: z.string().min(1).max(50),
  ap_materno: z.string().max(50).optional(),
  email: z.string().email().optional().or(z.literal('')),
  telefono: z.string().max(20).optional(),
  fecha_nac: z.coerce.date().optional().nullable(),
});

const tramiteDataSchema = z.object({
  placa: z.string().max(10).optional(),
  marca: z.string().min(1).max(50),
  modelo: z.string().min(1).max(50),
  anio: z.number().int().min(1990).max(2027),
  monto: z.number().nonnegative().optional().nullable(),
});

export const tramiteSchema = z.object({
  cliente: clienteSchema,
  tramite: tramiteDataSchema,
});

export const tramiteUpdateSchema = z.object({
  placa: z.string().max(10).optional(),
  marca: z.string().min(1).max(50).optional(),
  modelo: z.string().min(1).max(50).optional(),
  anio: z.number().int().min(1990).max(2027).optional(),
  monto: z.number().nonnegative().optional().nullable(),

  cliente: z
    .object({
      tipo_doc: z.enum(['DNI', 'CE', 'RUC']).optional(),
      num_doc: z.string().min(1).max(20).optional(),
      nombres: z.string().min(1).max(100).optional(),
      ap_paterno: z.string().min(1).max(50).optional(),
      ap_materno: z.string().max(50).optional(),
      email: z.string().email().optional().or(z.literal('')),
      telefono: z.string().max(20).optional(),
      fecha_nac: z.coerce.date().optional().nullable(),
    })
    .optional(),
});

export const tramiteQuerySchema = z.object({
  estado: estadoTramiteSchema.optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().default(10),
  page: z.coerce.number().int().positive().default(1),
});

export const cambiarEstadoSchema = z.object({
  nuevoEstado: estadoTramiteSchema,
  comentario: z.string().max(500).optional(),
  usuario: z.string().min(1).max(50).default('operador'),
});

export type TramiteInput = z.infer<typeof tramiteSchema>;
export type TramiteUpdateInput = z.infer<typeof tramiteUpdateSchema>;
export type TramiteQuery = z.infer<typeof tramiteQuerySchema>;
export type CambiarEstadoInput = z.infer<typeof cambiarEstadoSchema>;
export type EstadoTramiteInput = z.infer<typeof estadoTramiteSchema>;