import type { Request, Response, NextFunction } from 'express';
import { SeguimientoService } from './seguimiento.service.js';
import type { ApiResponse } from '../../../types/index.js';

const seguimientoService = new SeguimientoService();

export class SeguimientoController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tramiteId } = req.params;
      const seguimientos = await seguimientoService.obtenerHistorial(Number(tramiteId));
      
      const response: ApiResponse = {
        ok: true,
        data: seguimientos
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
