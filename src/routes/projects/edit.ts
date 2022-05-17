import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth, blockKams } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { ProjectRepo } from "../../repos/project-repo";

const router = express.Router();

router.put(
  "/projects/:id",
  requireAuth,
  blockKams,
  [
    body("pm_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a PmId"),
    body("note").trim(),
    body("version").trim(),
    body("revision").trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { pm_id, note, version, revision } = req.body;
    const { id } = req.params;

    const existingProject = await ProjectRepo.findById(id);
    if (!existingProject) {
      throw new BadRequestError("Project does not exist");
    }

    await checkPermissions(req, ProjectRepo, id);

    const updatedProject = await ProjectRepo.updateData({
      id,
      pm_id,
      note,
      version,
      revision,
    });

    res.status(200).send(updatedProject);
  }
);

export { router as updateProjectRouter };
