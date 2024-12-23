import { Response } from "express";
import { HTTP_STATUS_CODE } from "../utils/constants";

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandlerMiddleware(
  err: AppError,
  _: unknown,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: unknown,
) {
  const statusCode = err.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

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
