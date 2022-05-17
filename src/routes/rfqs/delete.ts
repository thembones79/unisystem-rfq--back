import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { RfqRepo } from "../../repos/rfq-repo";

const router = express.Router();

router.delete("/rfqs/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  let existingRfq = await RfqRepo.findById(id);
  if (!existingRfq) {
    throw new BadRequestError("RFQ does not exists");
  }

  await checkPermissions(req, RfqRepo, id);

  const rfq = await RfqRepo.delete(id);
  res.send(rfq);
});

export { router as deleteRfqRouter };
