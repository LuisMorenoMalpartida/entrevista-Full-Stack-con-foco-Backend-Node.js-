import { ClienteRepository } from './cliente.repository.js';
import type { Cliente } from '../../types/index.js';
import { BusinessError, NotFoundError } from '../../utils/errors.js';

export class ClienteService {
  private repository: ClienteRepository;

  constructor() {
    this.repository = new ClienteRepository();
  }

  async listarClientes(search?: string, limit: number = 10, page: number = 1): Promise<{
    clientes: Cliente[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const { clientes, total } = await this.repository.findAll(search, limit, offset);
    
    return {
      clientes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async obtenerCliente(id: number): Promise<Cliente> {
    const cliente = await this.repository.findById(id);
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }
    return cliente;
  }

  async crearCliente(clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const existing = await this.repository.findByTipoDocNumDoc(
      clienteData.tipo_doc,
      clienteData.num_doc
    );

    if (existing) {
      throw new BusinessError(`Ya existe un cliente con ${clienteData.tipo_doc} ${clienteData.num_doc}`);
    }

    return await this.repository.create(clienteData);
  }

  async editarCliente(id: number, clienteData: Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>): Promise<Cliente> {
    await this.obtenerCliente(id);

    if (clienteData.tipo_doc && clienteData.num_doc) {
      const existing = await this.repository.findByTipoDocNumDoc(
        clienteData.tipo_doc,
        clienteData.num_doc
      );
      
      if (existing && existing.id !== id) {
        throw new BusinessError(`Ya existe un cliente con ${clienteData.tipo_doc} ${clienteData.num_doc}`);
      }
    }

    return await this.repository.update(id, clienteData);
  }

  async obtenerOcrearCliente(
    tipo_doc: 'DNI' | 'CE' | 'RUC',
    num_doc: string,
    clienteData?: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Cliente> {
    let cliente = await this.repository.findByTipoDocNumDoc(tipo_doc, num_doc);
    
    if (!cliente && clienteData) {
      const nuevoCliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'> = {
        tipo_doc,
        num_doc,
        nombres: clienteData.nombres,
        ap_paterno: clienteData.ap_paterno,
        ap_materno: clienteData.ap_materno,
        email: clienteData.email,
        telefono: clienteData.telefono,
        fecha_nac: clienteData.fecha_nac
      };
      cliente = await this.repository.create(nuevoCliente);
    }
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }
    
    return cliente;
  }
}