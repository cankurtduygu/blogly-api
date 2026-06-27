import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;

  res.status(statusCode).json({
    error: true,
    message: err.message,
    cause: err.cause,
  });
};