import express from "express";
import { requireAuth } from "../../middlewares";
import { ProjectRepo } from "../../repos/project-repo";

const router = express.Router();

router.get("/projects", requireAuth, async (req, res) => {
  const projects = await ProjectRepo.find();
  res.send(projects);
});

export { router as projectListRouter };
