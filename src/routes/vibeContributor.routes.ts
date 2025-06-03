import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import prisma from "../config/prisma";

const router = Router();

// Add contributor to vibe
router.post("/", auth, async (req, res) => {
  try {
    const { vibeId, userId, role } = req.body;

    // Check if vibe exists
    const vibe = await prisma.vibe.findUnique({
      where: { id: vibeId },
    });

    if (!vibe) {
      return res.status(404).json({ error: "Vibe not found" });
    }

    // Check if user is the creator
    if (vibe.createdBy !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Check if contributor already exists
    const existingContributor = await prisma.vibeContributor.findFirst({
      where: {
        vibeId,
        userId,
      },
    });

    if (existingContributor) {
      return res.status(400).json({ error: "User is already a contributor" });
    }

    // Add contributor
    const contributor = await prisma.vibeContributor.create({
      data: {
        vibeId,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(contributor);
  } catch (error) {
    res.status(500).json({ error: "Error adding contributor" });
  }
});

// Get all contributors for a vibe
router.get("/vibe/:vibeId", auth, async (req, res) => {
  try {
    const contributors = await prisma.vibeContributor.findMany({
      where: {
        vibeId: req.params.vibeId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(contributors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching contributors" });
  }
});

// Update contributor role
router.put("/:id", auth, async (req, res) => {
  try {
    const { role } = req.body;

    // Check if contributor exists
    const contributor = await prisma.vibeContributor.findUnique({
      where: { id: req.params.id },
      include: {
        vibe: true,
      },
    });

    if (!contributor) {
      return res.status(404).json({ error: "Contributor not found" });
    }

    // Check if user is the vibe creator
    if (contributor.vibe.createdBy !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Update contributor
    const updatedContributor = await prisma.vibeContributor.update({
      where: { id: req.params.id },
      data: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedContributor);
  } catch (error) {
    res.status(500).json({ error: "Error updating contributor" });
  }
});

// Remove contributor
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if contributor exists
    const contributor = await prisma.vibeContributor.findUnique({
      where: { id: req.params.id },
      include: {
        vibe: true,
      },
    });

    if (!contributor) {
      return res.status(404).json({ error: "Contributor not found" });
    }

    // Check if user is the vibe creator
    if (contributor.vibe.createdBy !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Remove contributor
    await prisma.vibeContributor.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error removing contributor" });
  }
});

export default router;
