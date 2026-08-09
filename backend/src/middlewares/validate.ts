import type { Request, Response, NextFunction } from 'express';
import { type AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';

export function validate(schema: AnyZodObject) {
  return async (_req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: _req.body,
        query: _req.query,
        params: _req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          campo: err.path.join('.'),
          detalle: err.message,
        }));
        next(new ValidationError(errors));
      } else {
        next(error);
      }
    }
  };
}
