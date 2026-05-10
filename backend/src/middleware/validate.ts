import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

type ValidatePart = 'body' | 'query' | 'params';

/**
 * Zod validation middleware factory.
 * Usage: router.post('/route', validate(schema), controller)
 */
export const validate =
  (schema: any, part: ValidatePart = 'body') =>
    (req: Request, _res: Response, next: NextFunction): void => {
      try {
        schema.parse(req[part]);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const message = error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', ');
          next(new AppError(message, 400));
        } else {
          next(error);
        }
      }
    };
