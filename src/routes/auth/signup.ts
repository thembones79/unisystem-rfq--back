import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { keys } from "../../config/keys";
import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError, NotAuthorizedError } from "../../errors";
import { UserRepo } from "../../repos/user-repo";
import { Password } from "../../services/password";

const router = express.Router();

router.post(
  "/users/signup",
  requireAuth,
  [
    body("email")
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage("Email must be valid"),
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

    const { email, password, username, shortname, role_id } = req.body;
    const existingUser = await UserRepo.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Email in use", "email");
    }

    const hashed = await Password.toHash(password);
    const user = await UserRepo.insert({
      email,
      password: hashed,
      username,
      shortname,
      role_id,
    });

    delete user.password;

    res.status(201).send(user);
  }
);

export { router as signupRouter };
