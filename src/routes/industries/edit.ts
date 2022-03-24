import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { IndustryRepo } from "../../repos/industry-repo";

const router = express.Router();

router.put(
  "/industries/:id",
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
    const { id } = req.params;

    const existingIndustry = await IndustryRepo.findById(id);
    if (!existingIndustry) {
      throw new BadRequestError("Industry does not exist");
    }

    const newIndustry = await IndustryRepo.updateData({
      id,
      name,
    });

    res.status(200).send(newIndustry);
  }
);

export { router as updateIndustryRouter };
