import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

import { errorHandler } from "./utils/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Routes
app.use("/api/auth", authRoutes);
 // inventory routes like /:id/purchase

// Error handling middleware
app.use(errorHandler);

export default app;
