const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const prisma = new PrismaClient();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, password, bio, city, profilePic } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { name },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        bio,
        city,
        profilePic,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: { name },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Please authenticate" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "Please authenticate" });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
});

module.exports = router;
