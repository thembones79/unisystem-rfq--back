import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { OfferRepo } from "../../repos/offer-repo";

const router = express.Router();

router.delete("/offers/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  let existingoffer = await OfferRepo.findById(id);
  if (!existingoffer) {
    throw new BadRequestError("offer does not exists");
  }

  await checkPermissions(req, OfferRepo, id);

  const offer = await OfferRepo.delete(id);
  res.send(offer);
});

export { router as deleteOfferRouter };
