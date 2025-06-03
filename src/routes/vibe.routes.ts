import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  createVibe,
  getAllVibes,
  getVibeById,
  updateVibe,
  deleteVibe,
} from "../controllers/vibe.controller";

const router = Router();

// Create vibe
router.post("/", auth, createVibe);

// Get all vibes
router.get("/", auth, getAllVibes);

// Get vibe by ID
router.get("/:id", auth, getVibeById);

// Update vibe
router.put("/:id", auth, updateVibe);

// Delete vibe
router.delete("/:id", auth, deleteVibe);

export default router;
