import express from "express";
import { requireAuth } from "../../middlewares";
import { OfferRepo } from "../../repos/offer-repo";
import { getAllowedData } from "../../services/getAllowedData";

const router = express.Router();

router.get("/offers", requireAuth, async (req, res) => {
  const offers = await getAllowedData(req, OfferRepo);

  res.send(offers);
});

export { router as offerListRouter };
