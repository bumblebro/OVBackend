import jwt from "jsonwebtoken";
import { env } from "node:process";

export const generateToken = (payload: { id: string }): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { id: string };
  } catch (error) {
    console.log(`error`, error);
    throw new Error("Invalid token");
  }
};
