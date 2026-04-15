import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./utils/errorHandler.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Routes
app.use("/api/auth", authRoutes);
import leadRoutes from "./routes/leadRoutes.js";

// ... baki setup
app.use("/api/leads", leadRoutes);
// Test root route
app.get("/", (req, res) => {
  res.send("API is running...");
});



// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
