const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const auth = require("../middleware/auth");

// Get all notifications for current user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { readAt: new Date() },
    });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark all notifications as read
router.put("/read-all", auth, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        readAt: null,
      },
      data: { readAt: new Date() },
    });
    res.status(200).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a notification
router.delete("/:id", auth, async (req, res) => {
  try {
    await prisma.notification.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
