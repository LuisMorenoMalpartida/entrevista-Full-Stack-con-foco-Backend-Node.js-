import models from '../../../config/models/index.js';
import type { TramiteSeguimiento } from '../../../types/index.js';
const { TramiteSeguimiento: SeguimientoModel } = models;

export class SeguimientoRepository {
  async create(seguimientoData: Omit<TramiteSeguimiento, 'id' | 'created_at'>, options?: any): Promise<TramiteSeguimiento> {
    const seguimiento = await SeguimientoModel.create(seguimientoData as any, options);
    return seguimiento.get({ plain: true }) as TramiteSeguimiento;
  }

  async findByTramiteId(tramiteId: number): Promise<TramiteSeguimiento[]> {
    const seguimientos = await SeguimientoModel.findAll({
      where: { tramite_id: tramiteId },
      order: [['created_at', 'ASC']],
    });
    return seguimientos.map((s: any) => s.get({ plain: true }) as TramiteSeguimiento);
  }

  async deleteByTramiteId(tramiteId: number, options?: any): Promise<void> {
    await SeguimientoModel.destroy({ where: { tramite_id: tramiteId }, ...options });
  }
}
