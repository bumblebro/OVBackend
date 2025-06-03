import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createVibe = async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    const vibe = await prisma.vibe.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy: req.user!.id,
        status: "DRAFT",
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(vibe);
  } catch (error) {
    res.status(500).json({ error: "Error creating vibe" });
  }
};

export const getAllVibes = async (req: Request, res: Response) => {
  try {
    const vibes = await prisma.vibe.findMany({
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contributors: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        media: true,
      },
    });
    res.json(vibes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching vibes" });
  }
};

export const getVibeById = async (req: Request, res: Response) => {
  try {
    const vibe = await prisma.vibe.findUnique({
      where: { id: req.params.id },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contributors: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        media: true,
      },
    });

    if (!vibe) {
      return res.status(404).json({ error: "Vibe not found" });
    }

    res.json(vibe);
  } catch (error) {
    res.status(500).json({ error: "Error fetching vibe" });
  }
};

export const updateVibe = async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate, status } = req.body;

    // Check if vibe exists
    const vibe = await prisma.vibe.findUnique({
      where: { id: req.params.id },
    });

    if (!vibe) {
      return res.status(404).json({ error: "Vibe not found" });
    }

    // Check if user is the creator
    if (vibe.createdBy !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Update vibe
    const updatedVibe = await prisma.vibe.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status }),
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contributors: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        media: true,
      },
    });

    res.json(updatedVibe);
  } catch (error) {
    res.status(500).json({ error: "Error updating vibe" });
  }
};

export const deleteVibe = async (req: Request, res: Response) => {
  try {
    // Check if vibe exists
    const vibe = await prisma.vibe.findUnique({
      where: { id: req.params.id },
    });

    if (!vibe) {
      return res.status(404).json({ error: "Vibe not found" });
    }

    // Check if user is the creator
    if (vibe.createdBy !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete vibe
    await prisma.vibe.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting vibe" });
  }
};
