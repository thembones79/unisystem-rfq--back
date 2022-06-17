import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { OfferRepo } from "../../repos/offer-repo";

const router = express.Router();

router.put(
  "/offers/:id",
  requireAuth,
  [body("ranges_margins").trim()],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      ranges_margins,
      for_buffer,
      pick_from_buffer,
      footer_pl,
      footer_en,
      buffer_pl,
      buffer_en,
      contents,
    } = req.body;

    const { id } = req.params;

    const existingOffer = await OfferRepo.findById(id);
    if (!existingOffer) {
      throw new BadRequestError("Offer does not exist");
    }

    await checkPermissions(req, OfferRepo, id);

    const offer = await OfferRepo.updateData({
      id,
      ranges_margins,
      for_buffer,
      pick_from_buffer,
      footer_pl,
      footer_en,
      buffer_pl,
      buffer_en,
      contents,
    });

    res.status(200).send(offer);
  }
);

export { router as updateOfferRouter };
