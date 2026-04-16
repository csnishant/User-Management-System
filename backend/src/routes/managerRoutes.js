import express from "express";

// Middleware imports
import { protect } from "../middleware/authMiddleware.js";
import { isManager } from "../middleware/isRole.js";
import { GetAllUsers, UpdateUser } from "../controllers/managerController.js";

const router = express.Router();

/**
 * 🔐 Manager Access Middleware
 * Only allows logged-in users with the 'manager' role.
 */
const managerAccess = [protect, isManager];

// 👇 VIEW LIST OF USERS
// Managers can only view users, they cannot create them (POST).
router
  .route("/users")
  .all(...managerAccess)
  .get(GetAllUsers);

// 👇 VIEW AND UPDATE SINGLE USER
// Managers can update details, but they cannot delete (DELETE).
router
  .route("/users/:id")
  .all(...managerAccess)
  .put(UpdateUser);

export default router;
