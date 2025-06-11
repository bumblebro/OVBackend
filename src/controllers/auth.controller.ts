import { Request, Response } from "express";
import prisma from "../config/prisma";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { email, name, uid } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user
      const user = await prisma.user.update({
        where: { email },
        data: {
          name,
          firebaseUid: uid,
        },
      });

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        username: name,
        firebaseUid: uid,
        passwordHash: "", // Required field but not used with Firebase
      },
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error syncing user", details: error });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    console.log(`Fetching user with Firebase UID: ${req.user!.id}`);
    
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user!.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};
