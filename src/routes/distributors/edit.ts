import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { DistributorRepo } from "../../repos/distributor-repo";

const router = express.Router();

router.put(
  "/distributors/:id",
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
    const { id } = req.params;

    const existingDistributor = await DistributorRepo.findById(id);
    if (!existingDistributor) {
      throw new BadRequestError("Distributor does not exist");
    }

    const newDistributor = await DistributorRepo.updateData({
      id,
      name,
    });

    res.status(200).send(newDistributor);
  }
);

export { router as updateDistributorRouter };
