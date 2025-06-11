import { Request, Response, NextFunction } from "express";
import { env } from "node:process";
// import env from "../config/env";

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error in development
  if (env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};
