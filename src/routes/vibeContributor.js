const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Create a new vibe contributor
router.post("/", async (req, res) => {
  const { vibeId, userId, role } = req.body;
  try {
    const contributor = await prisma.vibeContributor.create({
      data: {
        vibeId,
        userId,
        role,
      },
    });
    res.status(201).json(contributor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all vibe contributors
router.get("/", async (req, res) => {
  try {
    const contributors = await prisma.vibeContributor.findMany();
    res.json(contributors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single vibe contributor by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const contributor = await prisma.vibeContributor.findUnique({
      where: { id },
    });
    if (!contributor) {
      return res.status(404).json({ error: "Vibe contributor not found" });
    }
    res.json(contributor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a vibe contributor
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const contributor = await prisma.vibeContributor.update({
      where: { id },
      data: {
        role,
      },
    });
    res.json(contributor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a vibe contributor
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.vibeContributor.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
