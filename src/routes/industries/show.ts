import express from "express";
import { requireAuth } from "../../middlewares";
import { IndustryRepo } from "../../repos/industry-repo";
import { NotFoundError } from "../../errors";

const router = express.Router();

router.get("/industries/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const industry = await IndustryRepo.findById(id);

  if (!industry) {
    throw new NotFoundError();
  }

  res.send(industry);
});

export { router as showIndustryRouter };
