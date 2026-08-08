import type { EstadoTramite } from '../types/index.js';

export const TRANSICIONES_PERMITIDAS: Record<EstadoTramite, EstadoTramite[]> = {
  REGISTRADO: ['EN_FIRMAS', 'ANULADO'],
  EN_FIRMAS: ['PRESENTADO', 'OBSERVADO', 'ANULADO'],
  OBSERVADO: ['EN_FIRMAS', 'PRESENTADO', 'ANULADO'],
  PRESENTADO: ['INSCRITO', 'OBSERVADO'],
  INSCRITO: ['CERRADO'],
  CERRADO: [],
  ANULADO: [],
};

export const ESTADOS_FINALES: EstadoTramite[] = ['CERRADO', 'ANULADO'];
export const ESTADOS_NO_ELIMINABLES: EstadoTramite[] = ['INSCRITO', 'CERRADO'];

export function validarTransicion(
  estadoActual: EstadoTramite,
  nuevoEstado: EstadoTramite
): boolean {
  const transiciones = TRANSICIONES_PERMITIDAS[estadoActual];
  return transiciones.includes(nuevoEstado);
}

export function esEstadoFinal(estado: EstadoTramite): boolean {
  return ESTADOS_FINALES.includes(estado);
}