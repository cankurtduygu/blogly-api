import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

  if(err.name === "CastError"){
    return res.status(400).json({error: true, message: "Invalid ID format."})
  }

  // Duplicate key (unique alan çakışması)
  if (err.code === 11000) {
    return res.status(409).json({ error: true, message: "This record already exists." });
  }

   // Validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: true, message: err.message });
  }

  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    error: true,
    message: err.message,
    cause: err.cause,
  });
};