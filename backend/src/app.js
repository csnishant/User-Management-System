import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

// ✅ FIX: CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Aapka frontend URL
  credentials: true, // Cookies aur Tokens allow karne ke liye
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Default cors() ki jagah corsOptions use karein
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/manager", managerRoutes);

// Error middleware (ALWAYS LAST)
app.use(errorHandler);

export default app;
