import type { Request, Response, NextFunction } from 'express';
import { TramiteService } from './tramite.service.js';
import type { ApiResponse } from '../../types/index.js';

const tramiteService = new TramiteService();

export class TramiteController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { estado, search, limit = 10, page = 1 } = req.query;
      const result = await tramiteService.listarTramites(
        estado as any,
        search as string | undefined,
        Number(limit),
        Number(page)
      );
      
      const response: ApiResponse = {
        ok: true,
        data: result
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async obtener(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tramite = await tramiteService.obtenerTramite(Number(id));
      
      const response: ApiResponse = {
        ok: true,
        data: tramite
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cliente, tramite } = req.body;
      const result = await tramiteService.crearTramite(cliente, tramite);
      
      const response: ApiResponse = {
        ok: true,
        data: result,
        mensaje: 'Trámite creado exitosamente'
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { cliente, tramite } = req.body;

    const result = await tramiteService.editarTramite(
      Number(id),
      tramite,
      cliente
    );

    const response: ApiResponse = {
      ok: true,
      data: result,
      mensaje: 'Trámite actualizado exitosamente'
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

  async cambiarEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { nuevoEstado, comentario } = req.body;
      const result = await tramiteService.cambiarEstado(
        Number(id),
        nuevoEstado,
        comentario,
        'operador'
      );
      
      const response: ApiResponse = {
        ok: true,
        data: result,
        mensaje: 'Estado actualizado exitosamente'
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await tramiteService.eliminarTramite(Number(id));
      
      const response: ApiResponse = {
        ok: true,
        mensaje: 'Trámite eliminado exitosamente'
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
