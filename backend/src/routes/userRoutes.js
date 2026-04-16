import express from "express";
const router = express.Router();
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

// Sabhi profile routes protected honge
router.use(protect);

router
  .route("/profile")
  .get(getMyProfile) // GET /api/v1/user/profile
  .put(updateMyProfile); // PUT /api/v1/user/profile

export default router;
