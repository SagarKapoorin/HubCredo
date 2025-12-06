import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { User, IUser } from "../models/User";
import { redisClient } from "../lib/redisClient";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not set");
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: IUser;
  token: string;
}

const createToken = (userId: string) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const getUserCacheKey = (email: string) => `user:email:${email.toLowerCase()}`;

export class AuthService {
  static async signup(input: SignupInput): Promise<AuthResult> {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      const error: any = new Error("Email already in use");
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash
    });

    const cacheKey = getUserCacheKey(user.email);
    try {
      await redisClient.set(cacheKey, JSON.stringify(user.toJSON()), {
        EX: 3600
      });
    } catch (e) {}

    const token = createToken(user.id);

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      const payload = {
        email: user.email,
        name: user.name,
        date: new Date().toISOString(),
        message: `Hi ${user.name} ! thanks for signing up. We are excited to see you onboard`
      };
      (async () => {
        try {
          await axios.post(webhookUrl, payload);
        } catch (e) {}
      })();
    }

    return { user, token };
  }

  static async login(input: LoginInput): Promise<AuthResult> {
    const cacheKey = getUserCacheKey(input.email);
    let user: IUser | null = null;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        user = new User(data);
      }
    } catch (e) {}

    if (!user) {
      user = await User.findOne({ email: input.email });
      if (user) {
        try {
          await redisClient.set(cacheKey, JSON.stringify(user.toJSON()), {
            EX: 3600
          });
        } catch (e) {}
      }
    }

    if (!user) {
      const error: any = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const token = createToken(user.id);

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      const payload = {
        email: user.email,
        name: user.name,
        date: new Date().toISOString(),
        message: `Hi ${user.name} ! thanks for logging in. We are excited to see you again`
      };
      (async () => {
        try {
          await axios.post(webhookUrl, payload);
        } catch (e) {}
      })();
    }

    return { user, token };
  }
}
