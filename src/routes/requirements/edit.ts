import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { RequirementRepo } from "../../repos/requirement-repo";
import { RfqRepo } from "../../repos/rfq-repo";

const router = express.Router();

router.put(
  "/requirements/:id",
  requireAuth,
  [
    body("rfq_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a RfqId"),
    body("c_nc_cwr")
      .trim()
      .notEmpty()
      .custom((value) => value === "c" || value === "nc" || value === "cwr")
      .withMessage("Only C, NC or CWR are allowed"),
    body("requirement")
      .trim()
      .notEmpty()
      .withMessage("You must supply a requirement"),
    body("priority")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a priority"),
    body("note").trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { rfq_id, c_nc_cwr, requirement, note, priority } = req.body;
    const { id } = req.params;

    let existingRequirement = await RequirementRepo.findById(id);
    if (!existingRequirement) {
      throw new BadRequestError("Requirement does not exists");
    }

    let existingRfq = await RfqRepo.findById(rfq_id);
    if (!existingRfq) {
      throw new BadRequestError("RFQ does not exists");
    }

    const updatedRequirement = await RequirementRepo.updateData({
      id,
      rfq_id,
      c_nc_cwr,
      requirement,
      note,
      priority,
    });

    res.status(200).send(updatedRequirement);
  }
);

export { router as updateRequirementRouter };
