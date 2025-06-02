const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const auth = require("../middleware/auth");

// Flag media content
router.post("/", auth, async (req, res) => {
  try {
    const { mediaId, reason } = req.body;

    // Check if already flagged
    const existing = await prisma.flaggedMedia.findFirst({
      where: {
        mediaId,
        userId: req.user.id,
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Media already flagged by you" });
    }

    const flaggedMedia = await prisma.flaggedMedia.create({
      data: {
        mediaId,
        userId: req.user.id,
        reason,
      },
    });

    // Update media's flagged status
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        isFlagged: true,
        flaggedReason: reason,
      },
    });

    res.status(201).json(flaggedMedia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all flagged media (admin only)
router.get("/", auth, async (req, res) => {
  try {
    // TODO: Add admin check
    const flaggedMedia = await prisma.flaggedMedia.findMany({
      include: {
        media: true,
        user: true,
      },
    });
    res.json(flaggedMedia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve flagged media (admin only)
router.put("/:id/resolve", auth, async (req, res) => {
  try {
    // TODO: Add admin check
    const flaggedMedia = await prisma.flaggedMedia.update({
      where: { id: req.params.id },
      data: {
        resolvedAt: new Date(),
      },
    });

    // Update media's flagged status
    await prisma.media.update({
      where: { id: flaggedMedia.mediaId },
      data: {
        isFlagged: false,
        flaggedReason: null,
      },
    });

    res.json(flaggedMedia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
