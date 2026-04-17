import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

// ✅ Sabhi Origins ki list (Local + Netlify)
const allowedOrigins = [
  "http://localhost:5173", // Local Frontend
  "https://user-management-sys-nis.netlify.app", // Aapka Netlify URL (Replace this)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Agar origin list mein hai ya origin null hai (like Postman/Mobile apps)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/manager", managerRoutes);

app.use(errorHandler);

export default app;
