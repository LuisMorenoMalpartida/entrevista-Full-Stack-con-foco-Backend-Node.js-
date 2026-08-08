import pool from '../../config/database.js';
import type { Cliente } from '../../types/index.js';
import { NotFoundError } from '../../utils/errors.js';

export class ClienteRepository {
  async findAll(search?: string, limit: number = 10, offset: number = 0): Promise<{ clientes: Cliente[]; total: number }> {
    let query = `
      SELECT * FROM clientes
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (num_doc ILIKE $${paramCount} OR nombres ILIKE $${paramCount} OR ap_paterno ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    paramCount++;
    query += ` ORDER BY id DESC LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);
    return {
      clientes: result.rows as Cliente[],
      total
    };
  }

  async findById(id: number): Promise<Cliente | null> {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE id = $1',
      [id]
    );
    return result.rows[0] as Cliente || null;
  }

  async findByTipoDocNumDoc(tipo_doc: string, num_doc: string): Promise<Cliente | null> {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE tipo_doc = $1 AND num_doc = $2',
      [tipo_doc, num_doc]
    );
    return result.rows[0] as Cliente || null;
  }

  async create(clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const { tipo_doc, num_doc, nombres, ap_paterno, ap_materno, email, telefono, fecha_nac } = clienteData;
    
    const result = await pool.query(
      `INSERT INTO clientes 
       (tipo_doc, num_doc, nombres, ap_paterno, ap_materno, email, telefono, fecha_nac)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [tipo_doc, num_doc, nombres, ap_paterno, ap_materno ?? null, email ?? null, telefono ?? null, fecha_nac ?? null]
    );
    
    return result.rows[0] as Cliente;
  }

  async update(id: number, clienteData: Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>): Promise<Cliente> {
    const fields: string[] = [];
    const values: (string | number | Date | null)[] = [];
    let paramCount = 0;

    const allowedFields = ['tipo_doc', 'num_doc', 'nombres', 'ap_paterno', 'ap_materno', 'email', 'telefono', 'fecha_nac'];
    
    for (const [key, value] of Object.entries(clienteData)) {
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
      UPDATE clientes 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Cliente');
    }

    return result.rows[0] as Cliente;
  }
}