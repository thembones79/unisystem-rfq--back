import express from "express";
import { requireAuth } from "../../middlewares";
import { DistributorRepo } from "../../repos/distributor-repo";
import { NotFoundError } from "../../errors";

const router = express.Router();

router.get("/distributors/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const distributor = await DistributorRepo.findById(id);

  if (!distributor) {
    throw new NotFoundError();
  }

  res.send(distributor);
});

export { router as showDistributorRouter };
