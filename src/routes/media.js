const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadToS3, deleteFromS3 } = require("../services/s3Service");

// Upload new media
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { vibeId, caption } = req.body;
    const fileUrl = await uploadToS3(req.file);

    const media = await prisma.media.create({
      data: {
        vibeId,
        userId: req.user.id,
        type: req.file.mimetype.startsWith("image/") ? "IMAGE" : "VIDEO",
        url: fileUrl,
        caption,
        exifData: JSON.stringify(req.file.mimetype),
      },
    });

    res.status(201).json(media);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload multiple media files
router.post("/batch", auth, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const { vibeId } = req.body;
    const mediaItems = [];

    for (const file of req.files) {
      const fileUrl = await uploadToS3(file);
      const media = await prisma.media.create({
        data: {
          vibeId,
          userId: req.user.id,
          type: file.mimetype.startsWith("image/") ? "IMAGE" : "VIDEO",
          url: fileUrl,
          exifData: JSON.stringify(file.mimetype),
        },
      });
      mediaItems.push(media);
    }

    res.status(201).json(mediaItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all media items
router.get("/", auth, async (req, res) => {
  try {
    const media = await prisma.media.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
      },
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single media item by ID
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
      },
    });
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a media item
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { caption } = req.body;
  try {
    const media = await prisma.media.update({
      where: { id },
      data: { caption },
    });
    res.json(media);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a media item
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Check if user is authorized to delete
    if (media.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this media" });
    }

    // Delete from S3
    await deleteFromS3(media.url);

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
