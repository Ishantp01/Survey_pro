// app.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();

const app = express();
app.use(express.json());

// connect DB (use env variable)
connectDB(process.env.MONGO_URI);

// mount routes

// basic health check
app.get("/", (req, res) => res.send("OK"));

export default app;
