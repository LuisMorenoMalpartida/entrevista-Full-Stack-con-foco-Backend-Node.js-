import { Op } from 'sequelize';
import models from '../../config/models/index.js';
import type { Tramite, EstadoTramite } from '../../types/index.js';
import { NotFoundError } from '../../utils/errors.js';
const { Tramite: TramiteModel, Cliente: ClienteModel } = models;

export class TramiteRepository {
  async findAll(
    estado?: EstadoTramite,
    search?: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ tramites: any[]; total: number }> {
    const where: any = {};
    const include: any = [
      {
        model: ClienteModel,
        as: 'cliente',
        required: true,
        attributes: ['id', 'tipo_doc', 'num_doc', 'nombres', 'ap_paterno', 'ap_materno', 'email', 'telefono', 'fecha_nac'],
      },
    ];

    if (estado) {
      where.estado = estado;
    }

    if (search) {
      include[0].where = {
        [Op.or]: [
          { codigo: { [Op.like]: `%${search}%` } },
          { num_doc: { [Op.like]: `%${search}%` } },
          { nombres: { [Op.like]: `%${search}%` } },
        ],
      };
      where.codigo = { [Op.like]: `%${search}%` };
    }

    const { rows: tramites, count: total } = await TramiteModel.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['id', 'DESC']],
      distinct: true,
    });

    return {
      tramites: tramites.map((t: any) => ({ ...t.get({ plain: true }), cliente: t.cliente ? t.cliente.get({ plain: true }) : null })),
      total,
    };
  }

  async findById(id: number): Promise<any | null> {
    const tramite = await TramiteModel.findByPk(id, {
      include: [
        {
          model: ClienteModel,
          as: 'cliente',
          attributes: ['id', 'tipo_doc', 'num_doc', 'nombres', 'ap_paterno', 'ap_materno', 'email', 'telefono', 'fecha_nac'],
        },
      ],
    });

    if (!tramite) return null;

    const plain = tramite.get({ plain: true }) as any;
    plain.cliente = plain.cliente ? plain.cliente.get({ plain: true }) : null;
    return plain;
  }

  async findByCodigo(codigo: string): Promise<Tramite | null> {
    const tramite = await TramiteModel.findOne({ where: { codigo } });
    return tramite ? (tramite.get({ plain: true }) as Tramite) : null;
  }

  async create(tramiteData: Omit<Tramite, 'id' | 'created_at' | 'updated_at'>, options?: any): Promise<Tramite> {
    const tramite = await TramiteModel.create(tramiteData as any, options);
    return tramite.get({ plain: true }) as Tramite;
  }

  async update(id: number, tramiteData: Partial<Omit<Tramite, 'id' | 'codigo' | 'cliente_id' | 'estado' | 'created_at' | 'updated_at'>>, options?: any): Promise<Tramite> {
    const tramite = await TramiteModel.findByPk(id);
    if (!tramite) {
      throw new NotFoundError('Trámite');
    }

    await tramite.update(tramiteData as any, options);
    return tramite.get({ plain: true }) as Tramite;
  }

  async updateEstado(id: number, estado: EstadoTramite, options?: any): Promise<Tramite> {
    const tramite = await TramiteModel.findByPk(id);
    if (!tramite) {
      throw new NotFoundError('Trámite');
    }

    await tramite.update({ estado }, options);
    return tramite.get({ plain: true }) as Tramite;
  }

  async delete(id: number, options?: any): Promise<void> {
    const result = await TramiteModel.destroy({ where: { id }, ...options });
    if (result === 0) {
      throw new NotFoundError('Trámite');
    }
  }

  async getNextCorrelativo(anio: number): Promise<number> {
    const result = await TramiteModel.count({
      where: {
        codigo: {
          [Op.like]: `INM-${anio}-%`,
        },
      },
    });
    return result + 1;
  }
}
