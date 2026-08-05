import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect Database
connectDB().catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// Test Route
app.get("/", (req, res) => {
  res.send("ClubView API is Running 🚀");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});