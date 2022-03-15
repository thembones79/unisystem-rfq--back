import express from "express";
import { requireAuth } from "../../middlewares";
import { RequirementRepo } from "../../repos/requirement-repo";

const router = express.Router();

router.get("/rfqs/:id/requirements", requireAuth, async (req, res) => {
  const { id } = req.params;
  const requirements = await RequirementRepo.findByRfqId(id);
  res.send(requirements);
});

export { router as showRequirementsForRfqRouter };
