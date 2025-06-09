import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import vibeRoutes from "./routes/vibe.routes";
import mediaRoutes from "./routes/media.routes";
import vibeContributorRoutes from "./routes/vibeContributor.routes";
import notificationRoutes from "./routes/notification.routes";
import favoriteRoutes from "./routes/favorite.routes";
import flaggedMediaRoutes from "./routes/flaggedMedia.routes";
import { env } from "process";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vibes", vibeRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/vibe-contributors", vibeContributorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/flagged-media", flaggedMediaRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
