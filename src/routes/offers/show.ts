import express from "express";
import { requireAuth } from "../../middlewares";
import { OfferRepo } from "../../repos/offer-repo";
import { NotFoundError, BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";

const router = express.Router();

router.get("/offers/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const offer = await OfferRepo.findById(id);

  if (!offer) {
    throw new NotFoundError();
  }

  await checkPermissions(req, OfferRepo, id);

  res.send(offer);
});

export { router as showOfferRouter };
