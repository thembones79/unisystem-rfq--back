import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError, NotAuthorizedError } from "../../errors";
import { UserRepo } from "../../repos/user-repo";

const router = express.Router();

router.put(
  "/users/:id",
  requireAuth,
  [
    body("email")
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage("Email must be valid"),
    body("username")
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage("Username must be between 2 and 40 characters"),
    body("shortname")
      .trim()
      .toUpperCase()
      .isLength({ min: 2, max: 8 })
      .withMessage("Shortname must be between 2 and 8 characters"),
    body("role_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a RoleId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (req.currentUser?.role_id !== 1) {
      throw new NotAuthorizedError();
    }

    const { id } = req.params;

    const { email, username, shortname, role_id } = req.body;
    const existingUser = await UserRepo.findById(id);
    if (!existingUser) {
      throw new BadRequestError("User does not exist");
    }

    const user = await UserRepo.updateData({
      id,
      email,
      username,
      shortname,
      role_id,
    });

    res.status(200).send(user);
  }
);

export { router as editUserRouter };
