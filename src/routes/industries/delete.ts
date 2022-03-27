import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { IndustryRepo } from "../../repos/industry-repo";
import { ProjectRepo } from "../../repos/project-repo";

const router = express.Router();

router.delete("/industries/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const existingIndustry = await IndustryRepo.findById(id);
  if (!existingIndustry) {
    throw new BadRequestError("Industry does not exists");
  }

  const projects = await ProjectRepo.findByIndustryId(id);
  if (projects && projects.length > 0) {
    throw new BadRequestError(
      "This industry has projects. Delete projects first in order to remove the industry."
    );
  }

  const deletedIndustry = await IndustryRepo.delete(id);
  res.send(deletedIndustry);
});

export { router as deleteIndustryRouter };
