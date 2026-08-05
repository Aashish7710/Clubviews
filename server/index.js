import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import authRoutes from "./routers/auth.js";
import eventRoutes from "./routers/event.js";


dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect Database
connectDB().catch((err) => {
  console.error(" MongoDB connection error:", err.message);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("ClubView API is Running ");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});