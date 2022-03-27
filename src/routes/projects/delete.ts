import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ProjectRepo } from "../../repos/project-repo";
import { PartnumberRepo } from "../../repos/partnumber-repo";

const router = express.Router();

router.delete("/projects/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const existingProject = await ProjectRepo.findById(id);
  if (!existingProject) {
    throw new BadRequestError("Project does not exist");
  }

  const partnumbers = await PartnumberRepo.findByProjectId(id);
  if (partnumbers && partnumbers.length > 0) {
    throw new BadRequestError(
      "This project has partnumbers. Delete partnumbers in order to remove the project."
    );
  }

  const deletedProject = await ProjectRepo.delete(id);
  res.send(deletedProject);
});

export { router as deleteProjectRouter };
