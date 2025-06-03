import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../config/prisma";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Please authenticate" });
      return;
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ error: "Please authenticate" });
      return;
    }

    req.user = { id: user.id };
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};
