import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors ?? err
      });
    }
  };

