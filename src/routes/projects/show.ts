import express from "express";
import { requireAuth } from "../../middlewares";
import { ProjectRepo } from "../../repos/project-repo";
import { NotFoundError } from "../../errors";

const router = express.Router();

router.get("/projects/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const project = await ProjectRepo.findById(id);

  if (!project) {
    throw new NotFoundError();
  }

  res.send(project);
});

export { router as showProjectRouter };
