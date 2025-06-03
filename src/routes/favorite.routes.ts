import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "../controllers/favorite.controller";

const router = Router();

// Add media to favorites
router.post("/", auth, addToFavorites);

// Get all favorites
router.get("/", auth, getFavorites);

// Remove media from favorites
router.delete("/:mediaId", auth, removeFromFavorites);

export default router;
