import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { RequirementRepo } from "../../repos/requirement-repo";

const router = express.Router();

router.post(
  "/requirements",
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

    const newRequirement = await RequirementRepo.insert({
      rfq_id,
      c_nc_cwr,
      requirement,
      note,
      priority,
    });

    res.status(201).send(newRequirement);
  }
);

export { router as newRequirementRouter };
