import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller";

const router = Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get current user
router.get("/me", auth, getCurrentUser);

export default router;
