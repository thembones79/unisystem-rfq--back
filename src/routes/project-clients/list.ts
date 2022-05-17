import express from "express";
import { requireAuth } from "../../middlewares";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { getAllowedData } from "../../services/getAllowedData";

const router = express.Router();

router.get("/clients", requireAuth, async (req, res) => {
  const clients = await getAllowedData(req, ProjectClientRepo);
  res.send(clients);
});

export { router as projectClientListRouter };
