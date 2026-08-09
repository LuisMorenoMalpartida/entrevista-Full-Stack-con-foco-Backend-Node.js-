import type { Request, Response, NextFunction } from 'express';
import { ClienteService } from './cliente.service.js';
import type { ApiResponse } from '../../types/index.js';

const clienteService = new ClienteService();

export class ClienteController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, limit = 10, page = 1 } = req.query;
      const result = await clienteService.listarClientes(
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
      const cliente = await clienteService.obtenerCliente(Number(id));
      
      const response: ApiResponse = {
        ok: true,
        data: cliente
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cliente = await clienteService.crearCliente(req.body);
      
      const response: ApiResponse = {
        ok: true,
        data: cliente,
        mensaje: 'Cliente creado exitosamente'
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const cliente = await clienteService.editarCliente(Number(id), req.body);
      
      const response: ApiResponse = {
        ok: true,
        data: cliente,
        mensaje: 'Cliente actualizado exitosamente'
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
