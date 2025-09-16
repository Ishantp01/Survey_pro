// app.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import helmet from 'helmet'

import userRoutes from "./routes/user.routes.js";
import formRoutes from "./routes/form.routes.js"
import timeslotroutes from "./routes/timeslot.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet())

// connect DB (use env variable)
connectDB(process.env.MONGO_URI);

// mount routes
app.use("/api/users", userRoutes);
app.use("/api/form", formRoutes);
app.use("/api/timeslot", timeslotroutes)

// basic health check
app.get("/", (req, res) => res.send("OK"));

export default app;
