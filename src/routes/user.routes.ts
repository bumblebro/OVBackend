import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

// Get all users
router.get("/", auth, getAllUsers);

// Get user by ID
router.get("/:id", auth, getUserById);

// Update user
router.put("/:id", auth, updateUser);

// Delete user
router.delete("/:id", auth, deleteUser);

export default router;
