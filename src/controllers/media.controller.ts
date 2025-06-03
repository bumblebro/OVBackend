import { Request, Response } from "express";
import { uploadToS3, deleteFromS3 } from "../utils/s3";
import prisma from "../config/prisma";

export const uploadSingleMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { vibeId, caption } = req.body;

    // Upload to S3
    const fileUrl = await uploadToS3(req.file);

    // Create media record
    const media = await prisma.media.create({
      data: {
        url: fileUrl,
        type: req.file.mimetype.startsWith("image/") ? "IMAGE" : "VIDEO",
        caption,
        vibeId,
        uploadedBy: req.user!.id,
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: "Error uploading media" });
  }
};

export const uploadMultipleMedia = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const { vibeId } = req.body;
    const mediaItems = [];

    for (const file of req.files) {
      // Upload to S3
      const fileUrl = await uploadToS3(file);

      // Create media record
      const media = await prisma.media.create({
        data: {
          url: fileUrl,
          type: file.mimetype.startsWith("image/") ? "IMAGE" : "VIDEO",
          vibeId,
          uploadedBy: req.user!.id,
        },
        include: {
          uploadedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      mediaItems.push(media);
    }

    res.status(201).json(mediaItems);
  } catch (error) {
    res.status(500).json({ error: "Error uploading media" });
  }
};

export const getAllMedia = async (req: Request, res: Response) => {
  try {
    const media = await prisma.media.findMany({
      include: {
        uploadedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: "Error fetching media" });
  }
};

export const getMediaById = async (req: Request, res: Response) => {
  try {
    const media = await prisma.media.findUnique({
      where: { id: req.params.id },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ error: "Error fetching media" });
  }
};

export const updateMedia = async (req: Request, res: Response) => {
  try {
    const { caption } = req.body;

    // Check if media exists
    const media = await prisma.media.findUnique({
      where: { id: req.params.id },
    });

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Check if user is the uploader
    if (media.uploadedBy !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Update media
    const updatedMedia = await prisma.media.update({
      where: { id: req.params.id },
      data: {
        caption,
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedMedia);
  } catch (error) {
    res.status(500).json({ error: "Error updating media" });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    // Check if media exists
    const media = await prisma.media.findUnique({
      where: { id: req.params.id },
    });

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Check if user is the uploader
    if (media.uploadedBy !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete from S3
    await deleteFromS3(media.url);

    // Delete media record
    await prisma.media.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting media" });
  }
};
