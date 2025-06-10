import { Request, Response, NextFunction } from "express";
import admin from "../firebase/firebaseAdmin";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "Please authenticate" });
      return;
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { id: decodedToken.uid, ...decodedToken };
    console.log(`decodedToken`, req.user);

    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};
