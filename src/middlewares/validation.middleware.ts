import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { HTTP_STATUS_CODE } from "../utils/constants";
import { errorHandlerMiddleware } from "./errorHandler.middleware";

export function validateData(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
      }

      next(errorHandlerMiddleware);
    }
  };
}
