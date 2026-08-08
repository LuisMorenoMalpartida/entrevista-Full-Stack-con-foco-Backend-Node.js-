import pool from '../backend/src/config/database.js';
import type { TramiteSeguimiento, EstadoTramite } from '../backend/src/types/index.js';

export class SeguimientoRepository {
  async create(seguimientoData: Omit<TramiteSeguimiento, 'id' | 'created_at'>): Promise<TramiteSeguimiento> {
    const { tramite_id, estado_anterior, estado_nuevo, comentario, usuario } = seguimientoData;
    
    const result = await pool.query(
      `INSERT INTO tramite_seguimiento 
       (tramite_id, estado_anterior, estado_nuevo, comentario, usuario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tramite_id, estado_anterior ?? null, estado_nuevo, comentario ?? null, usuario]
    );
    
    return result.rows[0] as TramiteSeguimiento;
  }

  async findByTramiteId(tramiteId: number): Promise<TramiteSeguimiento[]> {
    const result = await pool.query(
      'SELECT * FROM tramite_seguimiento WHERE tramite_id = $1 ORDER BY created_at ASC',
      [tramiteId]
    );
    return result.rows as TramiteSeguimiento[];
  }

  async deleteByTramiteId(tramiteId: number): Promise<void> {
    await pool.query(
      'DELETE FROM tramite_seguimiento WHERE tramite_id = $1',
      [tramiteId]
    );
  }
}