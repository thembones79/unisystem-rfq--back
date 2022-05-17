import express from "express";
import { requireAuth } from "../../middlewares";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { checkPermissions } from "../../services/checkPermissions";
import { NotFoundError } from "../../errors";

const router = express.Router();

router.get("/clients/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const client = await ProjectClientRepo.findById(id);

  if (!client) {
    throw new NotFoundError();
  }

  await checkPermissions(req, ProjectClientRepo, id);

  res.send(client);
});

export { router as showProjectClientRouter };
