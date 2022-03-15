import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError, NotAuthorizedError } from "../../errors";
import { UserRepo } from "../../repos/user-repo";

const router = express.Router();

router.post(
  "/users/disable",
  requireAuth,
  [
    body("id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a UserId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (req.currentUser?.role_id !== 1) {
      throw new NotAuthorizedError();
    }

    const { id } = req.body;
    const existingUser = await UserRepo.findById(id);
    if (!existingUser) {
      throw new BadRequestError("User does not exist");
    }

    if (req.currentUser?.email === existingUser.email) {
      throw new BadRequestError("You can't delete yourself");
    }

    const user = await UserRepo.markDeleted(id);

    res.status(200).send(user);
  }
);

export { router as disableUserRouter };
