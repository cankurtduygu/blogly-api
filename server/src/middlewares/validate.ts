import type { Request, Response, NextFunction } from "express";

import { CustomError } from "../utils/customError.js";
import type { ZodType } from "zod";

export const validate = (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
        new CustomError("Validation failed", 400, result.error.issues),
      );
    }
    next();
  };
