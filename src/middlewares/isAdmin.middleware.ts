import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error checking admin status" });
  }
};
