import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import {
  flagMedia,
  getAllFlaggedMedia,
  resolveFlaggedMedia,
} from "../controllers/flaggedMedia.controller";

const router = Router();

// Flag media
router.post("/", auth, flagMedia);

// Get all flagged media (admin only)
router.get("/", auth, isAdmin, getAllFlaggedMedia);

// Resolve flagged media (admin only)
router.put("/:id/resolve", auth, isAdmin, resolveFlaggedMedia);

export default router;
