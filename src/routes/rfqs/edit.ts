import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { RfqRepo } from "../../repos/rfq-repo";

const router = express.Router();

router.put(
  "/rfqs/:id",
  requireAuth,
  [
    body("eau")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a EAU"),
    body("customer_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a CustomerId"),
    body("distributor_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a DistributorId"),
    body("pm_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a PmId"),
    body("kam_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a KamId"),
    body("final_solutions").trim(),
    body("conclusions").trim(),
    body("samples_expected").trim(),
    body("mp_expected").trim(),
    body("eau_max").trim(),
    body("extra_note").trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      eau,
      customer_id,
      distributor_id,
      pm_id,
      kam_id,
      final_solutions,
      conclusions,
      samples_expected,
      mp_expected,
      eau_max,
      extra_note,
    } = req.body;
    const { id } = req.params;

    let existingRfq = await RfqRepo.findById(id);
    if (!existingRfq) {
      throw new BadRequestError("RFQ does not exist");
    }

    const rfq = await RfqRepo.updateData({
      id,
      eau,
      customer_id,
      distributor_id,
      pm_id,
      kam_id,
      final_solutions,
      conclusions,
      samples_expected,
      mp_expected,
      eau_max,
      extra_note,
    });

    res.status(200).send(rfq);
  }
);

export { router as updateRfqRouter };
