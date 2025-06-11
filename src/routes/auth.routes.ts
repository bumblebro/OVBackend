import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { syncUser, getCurrentUser } from "../controllers/auth.controller";

const router = Router();

// Sync user data with Firebase
router.post("/sync", syncUser);

// Get current user
router.get("/me", auth, getCurrentUser);

export default router;
