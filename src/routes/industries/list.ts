import express from "express";
import { requireAuth } from "../../middlewares";
import { IndustryRepo } from "../../repos/industry-repo";

const router = express.Router();

router.get("/industries", requireAuth, async (req, res) => {
  const industries = await IndustryRepo.find();
  res.send(industries);
});

export { router as industryListRouter };
