import { TramiteRepository } from './tramite.repository.js';
import { SeguimientoService } from '../../../../seguimiento/seguimiento.service.js';
import { ClienteService } from '../cliente/cliente.service.js';
import pool from '../../config/database.js';
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
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Obtener o crear cliente
      let cliente = await this.clienteService.obtenerOcrearCliente(
        clienteData.tipo_doc,
        clienteData.num_doc,
        clienteData
      );

      // Generar código
      const anio = new Date().getFullYear();
      const correlativo = await this.repository.getNextCorrelativo(anio);
      const codigo = `INM-${anio}-${String(correlativo).padStart(4, '0')}`;

      // Crear trámite
      const tramite = await this.repository.create({
        codigo,
        cliente_id: cliente.id,
        placa: tramiteData.placa,
        marca: tramiteData.marca,
        modelo: tramiteData.modelo,
        anio: tramiteData.anio,
        estado: 'REGISTRADO',
        monto: tramiteData.monto
      });

      // Crear primer seguimiento
      await this.seguimientoService.crearSeguimiento(
        tramite.id,
        null,
        'REGISTRADO',
        'Trámite creado',
        'operador'
      );

      await client.query('COMMIT');

      return {
        ...tramite,
        cliente
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async editarTramite(
    id: number,
    tramiteData: Partial<Omit<Tramite, 'id' | 'codigo' | 'cliente_id' | 'estado' | 'created_at' | 'updated_at'>>,
    clienteData?: Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<any> {
    const tramite = await this.obtenerTramite(id);
    
    // Verificar que no esté en estado final
    if (esEstadoFinal(tramite.estado)) {
      throw new BusinessError(`No se puede editar un trámite en estado ${tramite.estado}`);
    }

    // Actualizar cliente si se proporcionan datos
    let cliente = tramite.cliente;
    if (clienteData && Object.keys(clienteData).length > 0) {
      cliente = await this.clienteService.editarCliente(cliente.id, clienteData);
    }

    // Actualizar trámite
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

    // Validar transición
    await this.seguimientoService.crearSeguimiento(
      id,
      estadoActual,
      nuevoEstado,
      comentario,
      usuario
    );

    // Actualizar estado del trámite
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
    
    // Verificar si se puede eliminar
    if (ESTADOS_NO_ELIMINABLES.includes(estado)) {
      throw new BusinessError(`No se puede eliminar un trámite en estado ${estado}`);
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Eliminar seguimientos (ON DELETE CASCADE se encarga)
      await this.seguimientoService.eliminarHistorial(id);
      
      // Eliminar trámite
      await this.repository.delete(id);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}