import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.signup(req.body);
      res
        .cookie("token", token, cookieOptions)
        .status(201)
        .json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.login(req.body);
      res
        .cookie("token", token, cookieOptions)
        .status(200)
        .json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      next(err);
    }
  }
}

