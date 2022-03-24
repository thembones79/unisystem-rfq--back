import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { IndustryRepo } from "../../repos/industry-repo";

const router = express.Router();

router.post(
  "/industries",
  requireAuth,
  [
    body("name")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("You must supply a industry name"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.body;

    const existingIndustry = await IndustryRepo.findByName(name);
    if (existingIndustry) {
      throw new BadRequestError("Industry already exists", "name");
    }

    const newIndustry = await IndustryRepo.insert({
      name,
    });

    res.status(201).send(newIndustry);
  }
);

export { router as newIndustryRouter };
