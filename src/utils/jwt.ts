import jwt from "jsonwebtoken";
import env from "../config/env";

export const generateToken = (payload: { id: string }): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { id: string };
  } catch (error) {
    throw new Error("Invalid token");
  }
};
