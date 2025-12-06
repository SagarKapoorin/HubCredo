import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { redisClient } from "./lib/redisClient";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";

const app = express();
app.use(cors({
  origin:process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not set");
}

const start = async () => {
  try {
    await redisClient.connect();
    await mongoose.connect(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error", err);
    process.exit(1);
  }
};

start();
