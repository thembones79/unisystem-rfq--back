import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { DistributorRepo } from "../../repos/distributor-repo";
import { RfqRepo } from "../../repos/rfq-repo";

const router = express.Router();

router.delete("/distributors/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const existingDistributor = await DistributorRepo.findById(id);
  if (!existingDistributor) {
    throw new BadRequestError("Distributor does not exists");
  }

  const deletedDistributor = await DistributorRepo.delete(id);
  res.send(deletedDistributor);
});

export { router as deleteDistributorRouter };
