import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import type { ApiResponse } from '../types/index.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    const response: ApiResponse = {
      ok: false,
      mensaje: err.message,
    };

    if (err.errors) {
      response.errores = err.errors;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  res.status(500).json({
    ok: false,
    mensaje: 'Error interno del servidor',
  });
}
