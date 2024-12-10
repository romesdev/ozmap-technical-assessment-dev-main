import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export function errorHandlerMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;

  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    error: true,
    message,
    details: err.details || null, // Detalhes adicionais, se existirem
  });

  if (process.env.NODE_ENV !== 'production') {
    console.error(
      `[ERROR] ${statusCode} - ${message}`,
      err.details || err.stack
    );
  }
}
