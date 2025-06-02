const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const vibeRoutes = require("./routes/vibe");
const mediaRoutes = require("./routes/media");
const vibeContributorRoutes = require("./routes/vibeContributor");
const notificationRoutes = require("./routes/notification");
const favoriteRoutes = require("./routes/favorite");
const flaggedMediaRoutes = require("./routes/flaggedMedia");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vibes", vibeRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/vibe-contributors", vibeContributorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/flagged-media", flaggedMediaRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Vibe Backend API is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
