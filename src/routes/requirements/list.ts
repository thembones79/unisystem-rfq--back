import express from "express";
import { requireAuth } from "../../middlewares";
import { RequirementRepo } from "../../repos/requirement-repo";

const router = express.Router();

router.get("/requirements", requireAuth, async (req, res) => {
  const requirements = await RequirementRepo.find();
  res.send(requirements);
});

export { router as allRequirementsListRouter };
