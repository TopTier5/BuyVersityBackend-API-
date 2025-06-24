import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from "./Routes/userRoute.js";
import { advertRouter } from "./Routes/advertRoute.js";
import { connect } from "./Utils/error.js"; // <<< CORRECTED: Changed 'Utils' to 'utils'

dotenv.config(); // Load environment variables from .env file (should be in your root directory)

const app = express();

// Middleware (order matters - cors and json parser before routes)
app.use(cors());
app.use(express.json());

// Define PORT and MONGO_URI after dotenv.config() has loaded them
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/adverts", advertRouter);

// Basic route for checking API status
app.get("/", (req, res) => {
  res.send("BuyVersity API is running!");
});

// Database Connection and Server Start (using async IIFE or a function call)
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB!");
    app.listen(PORT, () => {
      console.log(`BuyVersity API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();

// Global Error Handler - Catches unhandled errors and sends a formatted response
app.use(connect);