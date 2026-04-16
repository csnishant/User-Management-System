import express from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Aapka JWT verification middleware

const router = express.Router();

// Sabhi routes protected honge
router.use(protect);

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);

export default router;
