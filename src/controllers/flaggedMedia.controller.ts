import { Request, Response } from "express";
import prisma from "../config/prisma";

export const flagMedia = async (req: Request, res: Response) => {
  try {
    const { mediaId, reason } = req.body;

    // Check if media exists
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Check if already flagged by user
    const existingFlag = await prisma.flaggedMedia.findFirst({
      where: {
        userId: req.user!.id,
        mediaId,
      },
    });

    if (existingFlag) {
      return res.status(400).json({ error: "Media already flagged by you" });
    }

    // Create flag
    const flag = await prisma.flaggedMedia.create({
      data: {
        userId: req.user!.id,
        mediaId,
        reason,
        status: "PENDING",
      },
      include: {
        media: {
          include: {
            uploadedByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update media flagged status
    await prisma.media.update({
      where: { id: mediaId },
      data: { flagged: true },
    });

    res.status(201).json(flag);
  } catch (error) {
    res.status(500).json({ error: "Error flagging media" });
  }
};

export const getAllFlaggedMedia = async (req: Request, res: Response) => {
  try {
    const flaggedMedia = await prisma.flaggedMedia.findMany({
      include: {
        media: {
          include: {
            uploadedByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(flaggedMedia);
  } catch (error) {
    res.status(500).json({ error: "Error fetching flagged media" });
  }
};

export const resolveFlaggedMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    // Check if flag exists
    const flag = await prisma.flaggedMedia.findUnique({
      where: { id },
    });

    if (!flag) {
      return res.status(404).json({ error: "Flag not found" });
    }

    // Update flag
    const updatedFlag = await prisma.flaggedMedia.update({
      where: { id },
      data: {
        status,
        resolution,
      },
      include: {
        media: {
          include: {
            uploadedByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If resolved, update media flagged status
    if (status === "RESOLVED") {
      await prisma.media.update({
        where: { id: flag.mediaId },
        data: { flagged: false },
      });
    }

    res.json(updatedFlag);
  } catch (error) {
    res.status(500).json({ error: "Error resolving flagged media" });
  }
};
