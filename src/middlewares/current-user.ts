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
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, keys.JWT_SECRET) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}

  next();
};
