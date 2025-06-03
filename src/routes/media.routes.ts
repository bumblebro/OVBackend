import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import {
  uploadSingleMedia,
  uploadMultipleMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
} from "../controllers/media.controller";

const router = Router();

// Upload single media
router.post("/single", auth, upload.single("media"), uploadSingleMedia);

// Upload multiple media
router.post("/multiple", auth, upload.array("media", 10), uploadMultipleMedia);

// Get all media
router.get("/", auth, getAllMedia);

// Get media by ID
router.get("/:id", auth, getMediaById);

// Update media
router.put("/:id", auth, updateMedia);

// Delete media
router.delete("/:id", auth, deleteMedia);

export default router;
