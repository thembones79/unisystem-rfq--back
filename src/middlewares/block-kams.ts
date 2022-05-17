import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors";

export const blockKams = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser || req.currentUser.role_id > 2) {
    throw new NotAuthorizedError();
  }

  next();
};
