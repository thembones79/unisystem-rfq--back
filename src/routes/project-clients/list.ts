import express from "express";
import { requireAuth } from "../../middlewares";
import { ProjectClientRepo } from "../../repos/project-client-repo";

const router = express.Router();

router.get("/clients", requireAuth, async (req, res) => {
  const clients = await ProjectClientRepo.find();
  res.send(clients);
});

export { router as projectClientListRouter };
