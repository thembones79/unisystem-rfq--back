import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ConfigRepo } from "../../repos/config-repo";

const router = express.Router();

router.post(
  "/configs",
  requireAuth,
  [
    body("name")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("You must supply a template name"),
    body("category").trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, category, template } = req.body;

    const { currentUser } = req;

    if (!currentUser) {
      throw new BadRequestError("You are not authorized to do that.");
    }

    const user_id = currentUser.id;

    const config = await ConfigRepo.insert({
      name,
      user_id,
      category,
      template,
    });

    res.status(201).send(config);
  }
);

export { router as newConfigRouter };
