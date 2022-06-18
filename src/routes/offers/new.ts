import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { RfqRepo } from "../../repos/rfq-repo";
import { OfferRepo } from "../../repos/offer-repo";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { concatZeros } from "../../services/concatZeros";

const router = express.Router();

router.post(
  "/offers",
  requireAuth,
  [
    body("rfq_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a RfqId"),
    body("project_client_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a CustomerId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      project_client_id,
      rfq_id,
      ranges_margins,
      for_buffer,
      pick_from_buffer,
      footer_pl,
      footer_en,
      buffer_pl,
      buffer_en,
      contents,
    } = req.body;

    const rfq = await RfqRepo.findById(rfq_id);
    const clientIdFromRfq = rfq.project_client_id;
    const clientIdToSet = rfq_id === "1" ? project_client_id : clientIdFromRfq;

    const client = await ProjectClientRepo.findById(clientIdToSet);
    if (!client) {
      throw new BadRequestError("Client does not exist");
    }
    const clientKamRole = client.kam_role as number;
    const department = clientKamRole === 4 ? "EX" : "PL";
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const kam = client.kam;
    const yearMonthKam = `${year}/${month}/${kam}`;
    const serial =
      (await OfferRepo.findMaxSerialForYearMonthKam(yearMonthKam)) + 1;

    const number = `${yearMonthKam}/${concatZeros(serial + "", 3)}`;

    const offer = await OfferRepo.insert({
      number,
      serial,
      year_month_kam: yearMonthKam,
      project_client_id: clientIdToSet,
      rfq_id,
      department,
      ranges_margins,
      for_buffer,
      pick_from_buffer,
      footer_pl,
      footer_en,
      buffer_pl,
      buffer_en,
      contents,
    });

    res.status(201).send(offer);
  }
);

export { router as newOfferRouter };
