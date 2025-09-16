// app.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import helmet from "helmet";

import userRoutes from "./routes/user.routes.js";
import formRoutes from "./routes/form.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());

// CORS (allow frontend dev server)
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN || "http://localhost:5173";
  res.header("Access-Control-Allow-Origin", origin === "*" ? "*" : origin);
  res.header("Vary", "Origin");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// connect DB (use env variable)
connectDB(process.env.MONGO_URI);

// mount routes
app.use("/api/users", userRoutes);
app.use("/api/form", formRoutes);

// basic health check
app.get("/", (req, res) => res.send("OK"));

export default app;
