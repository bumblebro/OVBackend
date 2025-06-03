import { Request, Response } from "express";
import prisma from "../config/prisma";

export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.body;

    // Check if media exists
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: req.user!.id,
        mediaId,
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ error: "Media already in favorites" });
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user!.id,
        mediaId,
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
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: "Error adding to favorites" });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: req.user!.id,
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
      },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Error fetching favorites" });
  }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.params;

    // Check if favorite exists
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: req.user!.id,
        mediaId,
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error removing from favorites" });
  }
};
