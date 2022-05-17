import express from "express";
import { requireAuth } from "../../middlewares";
import { ProjectRepo } from "../../repos/project-repo";
import { getAllowedData } from "../../services/getAllowedData";

const router = express.Router();

router.get("/projects", requireAuth, async (req, res) => {
  const projects = await getAllowedData(req, ProjectRepo);
  res.send(projects);
});

export { router as projectListRouter };
