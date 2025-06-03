import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.userId !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: "Error updating notification" });
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user!.id,
        read: false,
      },
      data: { read: true },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error updating notifications" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.userId !== req.user!.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.notification.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting notification" });
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    await prisma.notification.deleteMany({
      where: {
        userId: req.user!.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting notifications" });
  }
};
