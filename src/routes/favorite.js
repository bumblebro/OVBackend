const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const auth = require("../middleware/auth");

// Add media to favorites
router.post("/", auth, async (req, res) => {
  try {
    const { mediaId } = req.body;

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user.id,
        mediaId,
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Media already favorited" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        mediaId,
      },
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's favorites
router.get("/", auth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        media: true,
      },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from favorites
router.delete("/:mediaId", auth, async (req, res) => {
  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: req.user.id,
        mediaId: req.params.mediaId,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
