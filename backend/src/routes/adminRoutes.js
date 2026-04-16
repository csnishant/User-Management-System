import express from "express";
import {
  createUserByAdmin,
  updateUserRole,
  deleteUser,
  getAllUsers,
} from "../controllers/adminController.js";


import { isAdmin } from "../middleware/isAdmin.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 All routes protected (Admin only)
router.post("/create-user", protect, isAdmin, createUserByAdmin);

router.put("/update-role/:id", protect, isAdmin, updateUserRole);

router.delete("/delete-user/:id", protect, isAdmin, deleteUser);

router.get("/all-users", protect, isAdmin, getAllUsers);


export default router;
