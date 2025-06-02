const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Create a new vibe
router.post("/", async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    coverImage,
    type,
    state,
    adminId,
  } = req.body;
  try {
    const vibe = await prisma.vibe.create({
      data: {
        title,
        description,
        date,
        location,
        coverImage,
        type,
        state,
        adminId,
      },
    });
    res.status(201).json(vibe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all vibes
router.get("/", async (req, res) => {
  try {
    const vibes = await prisma.vibe.findMany();
    res.json(vibes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single vibe by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const vibe = await prisma.vibe.findUnique({
      where: { id },
    });
    if (!vibe) {
      return res.status(404).json({ error: "Vibe not found" });
    }
    res.json(vibe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a vibe
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location, coverImage, type, state } =
    req.body;
  try {
    const vibe = await prisma.vibe.update({
      where: { id },
      data: {
        title,
        description,
        date,
        location,
        coverImage,
        type,
        state,
      },
    });
    res.json(vibe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a vibe
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.vibe.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
