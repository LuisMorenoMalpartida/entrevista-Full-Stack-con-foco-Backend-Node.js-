import { Op } from 'sequelize';
import models from '../../config/models/index.js';
import type { Cliente } from '../../types/index.js';
import { NotFoundError } from '../../utils/errors.js';
const { Cliente: ClienteModel } = models;

export class ClienteRepository {
  async findAll(search?: string, limit: number = 10, offset: number = 0): Promise<{ clientes: Cliente[]; total: number }> {
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { num_doc: { [Op.like]: `%${search}%` } },
        { nombres: { [Op.like]: `%${search}%` } },
        { ap_paterno: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: clientes, count: total } = await ClienteModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      clientes: clientes as Cliente[],
      total,
    };
  }

  async findById(id: number): Promise<Cliente | null> {
    const cliente = await ClienteModel.findByPk(id);
    return cliente ? cliente.get({ plain: true }) as Cliente : null;
  }

  async findByTipoDocNumDoc(tipo_doc: string, num_doc: string): Promise<Cliente | null> {
    const cliente = await ClienteModel.findOne({ where: { tipo_doc, num_doc } });
    return cliente ? cliente.get({ plain: true }) as Cliente : null;
  }

  async create(clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const cliente = await ClienteModel.create(clienteData as any);
    return cliente.get({ plain: true }) as Cliente;
  }

  async update(id: number, clienteData: Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>): Promise<Cliente> {
    const cliente = await ClienteModel.findByPk(id);
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    await cliente.update(clienteData as any);
    return cliente.get({ plain: true }) as Cliente;
  }
}
