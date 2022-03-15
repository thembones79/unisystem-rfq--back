import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError, NotAuthorizedError } from "../../errors";
import { UserRepo } from "../../repos/user-repo";
import { Password } from "../../services/password";

const router = express.Router();

router.put(
  "/users/:id/changepassword",
  requireAuth,
  [
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("passwordConfirm")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new BadRequestError(
            "Password confirmation does not match password"
          );
        }
        return true;
      })
      .withMessage("Passwords are not equal"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (req.currentUser?.role_id !== 1) {
      throw new NotAuthorizedError();
    }

    const { id } = req.params;

    const { password } = req.body;
    const existingUser = await UserRepo.findById(id);
    if (!existingUser) {
      throw new BadRequestError("User does not exist");
    }

    const hashed = await Password.toHash(password);
    const user = await UserRepo.updatePassword({
      id,
      password: hashed,
    });

    res.status(200).send(user);
  }
);

export { router as changePasswordRouter };
