import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import bcrypt from "bcryptjs";

const app = express();

function parseCorsOrigins(): string[] {
  const explicit = process.env.CORS_ORIGINS?.trim();
  if (explicit) {
    return explicit
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const defaults = ["http://localhost:5173", "http://localhost:3000"];
  const extra = [process.env.FRONTEND_ORIGIN, process.env.LANDING_ORIGIN]
    .map((s) => s?.trim())
    .filter(Boolean) as string[];
  return [...new Set([...defaults, ...extra])];
}

const corsOrigins = parseCorsOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

export default app;
