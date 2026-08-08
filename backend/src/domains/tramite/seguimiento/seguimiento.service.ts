import { SeguimientoRepository } from './seguimiento.repository.js';
import type { TramiteSeguimiento, EstadoTramite } from '../backend/src/types/index.js';
import { BusinessError } from '../backend/src/utils/errors.js';
import { validarTransicion, esEstadoFinal } from '../backend/src/utils/estados.js';

export class SeguimientoService {
  private repository: SeguimientoRepository;

  constructor() {
    this.repository = new SeguimientoRepository();
  }

  async crearSeguimiento(
    tramiteId: number,
    estadoAnterior: EstadoTramite | null,
    estadoNuevo: EstadoTramite,
    comentario?: string,
    usuario: string = 'operador'
  ): Promise<TramiteSeguimiento> {
    // Validar la transición
    if (estadoAnterior) {
      if (esEstadoFinal(estadoAnterior)) {
        throw new BusinessError(`El estado ${estadoAnterior} es final, no permite cambios`);
      }
      
      if (!validarTransicion(estadoAnterior, estadoNuevo)) {
        throw new BusinessError(`No se puede pasar de ${estadoAnterior} a ${estadoNuevo}`);
      }
    }

    const seguimiento = await this.repository.create({
      tramite_id: tramiteId,
      estado_anterior: estadoAnterior,
      estado_nuevo: estadoNuevo,
      comentario,
      usuario
    });

    return seguimiento;
  }

  async obtenerHistorial(tramiteId: number): Promise<TramiteSeguimiento[]> {
    return await this.repository.findByTramiteId(tramiteId);
  }

  async eliminarHistorial(tramiteId: number): Promise<void> {
    await this.repository.deleteByTramiteId(tramiteId);
  }
}