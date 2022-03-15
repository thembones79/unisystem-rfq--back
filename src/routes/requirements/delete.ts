import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { RequirementRepo } from "../../repos/requirement-repo";

const router = express.Router();

router.delete("/requirements/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  let existingRequirement = await RequirementRepo.findById(id);
  if (!existingRequirement) {
    throw new BadRequestError("Requirement does not exists");
  }

  const deletedRequirement = await RequirementRepo.delete(id);
  res.send(deletedRequirement);
});

export { router as deleteRequirementRouter };
