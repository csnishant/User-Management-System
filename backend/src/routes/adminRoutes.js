import express from "express";
import {
  createUserByAdmin,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/adminController.js";


import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isRole.js";

const router = express.Router();

// 🔐 Common middleware
const adminAccess = [protect, isAdmin];

// 👇 USERS COLLECTION ROUTES
router
  .route("/users")
  .all(...adminAccess)
  .get(getAllUsers)
  .post(createUserByAdmin);

// 👇 SINGLE USER ROUTES
router
  .route("/users/:id")
  .all(...adminAccess)
  .put(updateUser)
  .delete(deleteUser);

export default router;
