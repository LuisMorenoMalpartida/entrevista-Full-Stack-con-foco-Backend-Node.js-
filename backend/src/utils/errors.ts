export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: Array<{ campo: string; detalle: string }>;

  constructor(
    mensaje: string,
    statusCode: number = 500,
    errors?: Array<{ campo: string; detalle: string }>,
    isOperational: boolean = true
  ) {
    super(mensaje);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors ?? [];
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(errors: Array<{ campo: string; detalle: string }>) {
    super('Datos inválidos', 422, errors);
  }
}

export class BusinessError extends AppError {
  constructor(mensaje: string) {
    super(mensaje, 409);
  }
}

export class NotFoundError extends AppError {
  constructor(recurso: string) {
    super(`${recurso} no encontrado`, 404);
  }
}