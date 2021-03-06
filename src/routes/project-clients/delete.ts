import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { checkPermissions } from "../../services/checkPermissions";
import { ProjectRepo } from "../../repos/project-repo";

const router = express.Router();

router.delete("/clients/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const existingClient = await ProjectClientRepo.findById(id);
  if (!existingClient) {
    throw new BadRequestError("Client does not exist");
  }

  await checkPermissions(req, ProjectClientRepo, id);

  const projects = await ProjectRepo.findByClientId(id);
  if (projects && projects.length > 0) {
    throw new BadRequestError(
      "This client has projects. Delete projects first in order to remove the client."
    );
  }

  const deletedProjectClient = await ProjectClientRepo.delete(id);
  res.send(deletedProjectClient);
});

export { router as deleteProjectClientRouter };
