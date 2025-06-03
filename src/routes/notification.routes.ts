import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller";

const router = Router();

// Get all notifications
router.get("/", auth, getAllNotifications);

// Mark notification as read
router.put("/:id/read", auth, markNotificationAsRead);

// Mark all notifications as read
router.put("/read-all", auth, markAllNotificationsAsRead);

// Delete notification
router.delete("/:id", auth, deleteNotification);

// Delete all notifications
router.delete("/", auth, deleteAllNotifications);

export default router;
