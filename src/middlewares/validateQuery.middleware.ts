import { ZodTypeAny, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        return res
          .status(400)
          .json({ error: 'Invalid query parameters', details: errorMessages });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
