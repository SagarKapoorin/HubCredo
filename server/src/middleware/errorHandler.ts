import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const status =
    typeof err.statusCode === "number"
      ? err.statusCode
      : err.name === "ValidationError"
      ? 400
      : err.name === "JsonWebTokenError"
      ? 401
      : 500;

  const message =
    status === 500 ? "Internal server error" : err.message || "Error";

  res.status(status).json({ message });
};

