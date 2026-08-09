import { TramiteRepository } from './tramite.repository.js';
import { SeguimientoService } from './seguimiento/seguimiento.service.js';
import { ClienteService } from '../cliente/cliente.service.js';
import models from '../../config/models/index.js';
import type { Tramite, Cliente, EstadoTramite } from '../../types/index.js';
import { BusinessError, NotFoundError } from '../../utils/errors.js';
import { ESTADOS_NO_ELIMINABLES, esEstadoFinal } from '../../utils/estados.js';

export class TramiteService {
  private repository: TramiteRepository;
  private seguimientoService: SeguimientoService;
  private clienteService: ClienteService;

  constructor() {
    this.repository = new TramiteRepository();
    this.seguimientoService = new SeguimientoService();
    this.clienteService = new ClienteService();
  }

  async listarTramites(
    estado?: EstadoTramite,
    search?: string,
    limit: number = 10,
    page: number = 1
  ): Promise<{
    tramites: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const { tramites, total } = await this.repository.findAll(
      estado,
      search,
      limit,
      offset
    );
    
    return {
      tramites,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async obtenerTramite(id: number): Promise<any> {
    const tramite = await this.repository.findById(id);
    if (!tramite) {
      throw new NotFoundError('Trámite');
    }
    
    const seguimientos = await this.seguimientoService.obtenerHistorial(id);
    
    return {
      ...tramite,
      seguimientos
    };
  }

  async crearTramite(
    clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>,
    tramiteData: Omit<Tramite, 'id' | 'codigo' | 'cliente_id' | 'estado' | 'created_at' | 'updated_at'>
  ): Promise<any> {
    const { sequelize } = models;

    try {
      const result = await sequelize.transaction(async (t: any) => {
        let cliente = await this.clienteService.obtenerOcrearCliente(
          clienteData.tipo_doc,
          clienteData.num_doc,
          clienteData
        );

        const anio = new Date().getFullYear();
        const correlativo = await this.repository.getNextCorrelativo(anio);
        const codigo = `INM-${anio}-${String(correlativo).padStart(4, '0')}`;

        const tramite = await this.repository.create({
          codigo,
          cliente_id: cliente.id,
          placa: tramiteData.placa,
          marca: tramiteData.marca,
          modelo: tramiteData.modelo,
          anio: tramiteData.anio,
          estado: 'REGISTRADO',
          monto: tramiteData.monto
        }, t);

        await this.seguimientoService.crearSeguimiento(
          tramite.id,
          null,
          'REGISTRADO',
          'Trámite creado',
          'operador',
          t
        );

        return {
          ...tramite,
          cliente
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async editarTramite(
    id: number,
    tramiteData: Partial<Omit<Tramite, 'id' | 'codigo' | 'cliente_id' | 'estado' | 'created_at' | 'updated_at'>>,
    clienteData?: Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<any> {
    const tramite = await this.obtenerTramite(id);
    
    if (esEstadoFinal(tramite.estado)) {
      throw new BusinessError(`No se puede editar un trámite en estado ${tramite.estado}`);
    }

    let cliente = tramite.cliente;
    if (clienteData && Object.keys(clienteData).length > 0) {
      cliente = await this.clienteService.editarCliente(cliente.id, clienteData);
    }

    const tramiteActualizado = await this.repository.update(id, tramiteData);

    return {
      ...tramiteActualizado,
      cliente
    };
  }

  async cambiarEstado(
    id: number,
    nuevoEstado: EstadoTramite,
    comentario?: string,
    usuario: string = 'operador'
  ): Promise<any> {
    const tramite = await this.repository.findById(id);
    if (!tramite) {
      throw new NotFoundError('Trámite');
    }

    const estadoActual = tramite.estado as EstadoTramite;

    await this.seguimientoService.crearSeguimiento(
      id,
      estadoActual,
      nuevoEstado,
      comentario,
      usuario
    );

    const tramiteActualizado = await this.repository.updateEstado(id, nuevoEstado);

    return {
      ...tramiteActualizado,
      cliente: {
        id: tramite.cliente_id,
        tipo_doc: tramite.tipo_doc,
        num_doc: tramite.num_doc,
        nombres: tramite.nombres,
        ap_paterno: tramite.ap_paterno,
        ap_materno: tramite.ap_materno,
        email: tramite.email,
        telefono: tramite.telefono,
        fecha_nac: tramite.fecha_nac
      }
    };
  }

  async eliminarTramite(id: number): Promise<void> {
    const tramite = await this.repository.findById(id);
    if (!tramite) {
      throw new NotFoundError('Trámite');
    }

    const estado = tramite.estado as EstadoTramite;
    
    if (ESTADOS_NO_ELIMINABLES.includes(estado)) {
      throw new BusinessError(`No se puede eliminar un trámite en estado ${estado}`);
    }

    const { sequelize } = models;

    try {
      await sequelize.transaction(async (t: any) => {
        await this.seguimientoService.eliminarHistorial(id, t);
        await this.repository.delete(id, t);
      });
    } catch (error) {
      throw error;
    }
  }
}
