import models from '../../../config/models/index.js';
import type { TramiteSeguimiento, EstadoTramite } from '../../../types/index.js';
import { BusinessError } from '../../../utils/errors.js';
import { validarTransicion, esEstadoFinal } from '../../../utils/estados.js';
const { TramiteSeguimiento: SeguimientoModel } = models;

export class SeguimientoService {
  async crearSeguimiento(
    tramiteId: number,
    estadoAnterior: EstadoTramite | null,
    estadoNuevo: EstadoTramite,
    comentario?: string,
    usuario: string = 'operador',
    options?: any
  ): Promise<TramiteSeguimiento> {
    if (estadoAnterior) {
      if (esEstadoFinal(estadoAnterior)) {
        throw new BusinessError(`El estado ${estadoAnterior} es final, no permite cambios`);
      }
      
      if (!validarTransicion(estadoAnterior, estadoNuevo)) {
        throw new BusinessError(`No se puede pasar de ${estadoAnterior} a ${estadoNuevo}`);
      }
    }

    const seguimiento = await SeguimientoModel.create({
      tramite_id: tramiteId,
      estado_anterior: estadoAnterior,
      estado_nuevo: estadoNuevo,
      comentario,
      usuario,
    }, options);

    return seguimiento.get({ plain: true }) as TramiteSeguimiento;
  }

  async obtenerHistorial(tramiteId: number): Promise<TramiteSeguimiento[]> {
    const seguimientos = await SeguimientoModel.findAll({
      where: { tramite_id: tramiteId },
      order: [['created_at', 'ASC']],
    });
    return seguimientos.map((s: any) => s.get({ plain: true }) as TramiteSeguimiento);
  }

  async eliminarHistorial(tramiteId: number, options?: any): Promise<void> {
    await SeguimientoModel.destroy({ where: { tramite_id: tramiteId }, ...options });
  }
}
