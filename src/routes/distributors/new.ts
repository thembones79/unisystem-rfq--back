import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { DistributorRepo } from "../../repos/distributor-repo";

const router = express.Router();

router.post(
  "/distributors",
  requireAuth,
  [
    body("name")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("You must supply a distributor name"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.body;

    const existingDistributor = await DistributorRepo.findByName(name);
    if (existingDistributor) {
      throw new BadRequestError("Distributor already exists", "name");
    }

    const newDistributor = await DistributorRepo.insert({
      name,
    });

    res.status(201).send(newDistributor);
  }
);

export { router as newDistributorRouter };
