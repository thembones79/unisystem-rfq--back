import express from "express";
import { requireAuth } from "../../middlewares";
import { ProjectRepo } from "../../repos/project-repo";
import { ClickUp } from "../../services/clickup";
import { NotFoundError } from "../../errors";

const router = express.Router();

router.get("/projects/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  let project = await ProjectRepo.findById(id);

  if (!project) {
    throw new NotFoundError();
  }

  let status = "task not found";

  try {
    status = await ClickUp.getTaskStatus(project.clickup_id);
  } catch (error: any) {
    console.error({ error });
  }

  if (status) {
    project = { ...project, status: status.toLowerCase() };
  }

  res.send(project);
});

export { router as showProjectRouter };
