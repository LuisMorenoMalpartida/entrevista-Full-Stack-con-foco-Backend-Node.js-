import pool from '../../config/database.js';
import type { Tramite, EstadoTramite, Cliente } from '../../types/index.js';
import { NotFoundError } from '../../utils/errors.js';

export class TramiteRepository {
  async findAll(
    estado?: EstadoTramite,
    search?: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ tramites: any[]; total: number }> {
    let query = `
      SELECT t.*, 
             c.id as cliente_id, c.tipo_doc, c.num_doc, c.nombres, c.ap_paterno, c.ap_materno,
             c.email, c.telefono, c.fecha_nac
      FROM tramites t
      JOIN clientes c ON t.cliente_id = c.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    let paramCount = 0;

    if (estado) {
      paramCount++;
      query += ` AND t.estado = $${paramCount}`;
      params.push(estado);
    }

    if (search) {
      paramCount++;
      query += ` AND (t.codigo ILIKE $${paramCount} OR c.num_doc ILIKE $${paramCount} OR c.nombres ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const countQuery = query.replace(
      'SELECT t.*, c.id as cliente_id, c.tipo_doc, c.num_doc, c.nombres, c.ap_paterno, c.ap_materno, c.email, c.telefono, c.fecha_nac',
      'SELECT COUNT(*) as total'
    );
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    paramCount++;
    query += ` ORDER BY t.id DESC LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);
    return {
      tramites: result.rows,
      total
    };
  }

  async findById(id: number): Promise<any | null> {
    const result = await pool.query(
      `SELECT t.*, 
              c.id as cliente_id, c.tipo_doc, c.num_doc, c.nombres, c.ap_paterno, c.ap_materno,
              c.email, c.telefono, c.fecha_nac
       FROM tramites t
       JOIN clientes c ON t.cliente_id = c.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByCodigo(codigo: string): Promise<Tramite | null> {
    const result = await pool.query(
      'SELECT * FROM tramites WHERE codigo = $1',
      [codigo]
    );
    return result.rows[0] || null;
  }

  async create(tramiteData: Omit<Tramite, 'id' | 'created_at' | 'updated_at'>): Promise<Tramite> {
    const { codigo, cliente_id, placa, marca, modelo, anio, estado, monto } = tramiteData;
    
    const result = await pool.query(
      `INSERT INTO tramites 
       (codigo, cliente_id, placa, marca, modelo, anio, estado, monto)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [codigo, cliente_id, placa ?? null, marca, modelo, anio, estado, monto ?? null]
    );
    
    return result.rows[0] as Tramite;
  }

  async update(id: number, tramiteData: Partial<Omit<Tramite, 'id' | 'created_at' | 'updated_at'>>): Promise<Tramite> {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    let paramCount = 0;

    const allowedFields = ['placa', 'marca', 'modelo', 'anio', 'monto'];
    
    for (const [key, value] of Object.entries(tramiteData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(value ?? null);
      }
    }

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    paramCount++;
    values.push(id);
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE tramites 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Trámite');
    }

    return result.rows[0] as Tramite;
  }

  async updateEstado(id: number, estado: EstadoTramite): Promise<Tramite> {
    const result = await pool.query(
      `UPDATE tramites 
       SET estado = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [estado, id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Trámite');
    }

    return result.rows[0] as Tramite;
  }

  async delete(id: number): Promise<void> {
    const result = await pool.query(
      'DELETE FROM tramites WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Trámite');
    }
  }

  async getNextCorrelativo(anio: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) as total FROM tramites WHERE codigo LIKE $1`,
      [`INM-${anio}-%`]
    );
    return parseInt(result.rows[0].total) + 1;
  }
}