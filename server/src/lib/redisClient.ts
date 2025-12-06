import { createClient } from "redis";

const url = process.env.REDIS_URL;

if (!url) {
  throw new Error("REDIS_URL not set");
}

export const redisClient = createClient({ url });

