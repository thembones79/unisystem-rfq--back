import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { keys } from "../config/keys";

interface UserPayload {
  id: string;
  email: string;
  username: string;
  role_id: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, keys.JWT_SECRET) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}

  next();
};
