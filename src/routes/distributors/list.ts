import express from "express";
import { requireAuth } from "../../middlewares";
import { DistributorRepo } from "../../repos/distributor-repo";

const router = express.Router();

router.get("/distributors", requireAuth, async (req, res) => {
  const distributors = await DistributorRepo.find();
  res.send(distributors);
});

export { router as distributorListRouter };
