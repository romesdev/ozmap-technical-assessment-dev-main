import { Response } from "express";

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandlerMiddleware(
  err: AppError,
  _: unknown,
  res: Response,
) {
  const statusCode = err.statusCode || 500;

  const message = err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    error: true,
    message,
    details: err.details || null,
  });

  if (process.env.NODE_ENV !== "production") {
    console.error(
      `[ERROR] ${statusCode} - ${message}`,
      err.details || err.stack,
    );
  }
}
