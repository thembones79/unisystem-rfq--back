import express from "express";
import { requireAuth } from "../../middlewares";
import { DistributorRepo } from "../../repos/distributor-repo";

const router = express.Router();

router.get("/distributors", requireAuth, async (req, res) => {
  const users = await DistributorRepo.find();
  res.send(users);
});

export { router as distributorListRouter };
