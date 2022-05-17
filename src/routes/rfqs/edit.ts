import express, { Request, Response } from "express";
import { body } from "express-validator";
import { getAllowedData } from "../../services/getAllowedData";
import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError, NotAuthorizedError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { RfqRepo } from "../../repos/rfq-repo";
import { ClickUp } from "../../services/clickup";

const router = express.Router();

router.put(
  "/rfqs/:id",
  requireAuth,
  [
    body("eau")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a EAU"),
    body("pm_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a PM ID"),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("You must supply a name for RFQ"),
    body("samples_expected").trim(),
    body("mp_expected").trim(),
    body("req_disp_tech").trim(),
    body("req_disp_size").trim(),
    body("req_disp_res").trim(),
    body("req_disp_brigt").trim(),
    body("req_disp_angle").trim(),
    body("req_disp_od").trim(),
    body("req_disp_aa").trim(),
    body("req_disp_inter").trim(),
    body("req_disp_ot").trim(),
    body("req_disp_st").trim(),
    body("req_disp_spec").trim(),
    body("req_tp_size").trim(),
    body("req_tp_aa").trim(),
    body("req_tp_tech").trim(),
    body("req_tp_od").trim(),
    body("req_tp_inter").trim(),
    body("req_tp_glass").trim(),
    body("req_tp_spec").trim(),
    body("req_others").trim(),
    body("final_solutions").trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      eau,
      pm_id,
      name,
      samples_expected,
      mp_expected,
      for_valuation,
      req_disp_tech,
      req_disp_size,
      req_disp_res,
      req_disp_brigt,
      req_disp_angle,
      req_disp_od,
      req_disp_aa,
      req_disp_inter,
      req_disp_ot,
      req_disp_st,
      req_disp_spec,
      req_tp_size,
      req_tp_aa,
      req_tp_tech,
      req_tp_od,
      req_tp_inter,
      req_tp_glass,
      req_tp_spec,
      req_others,
      final_solutions,
    } = req.body;
    const { id } = req.params;

    const existingRfq = await RfqRepo.findById(id);
    if (!existingRfq) {
      throw new BadRequestError("RFQ does not exist");
    }

    await checkPermissions(req, RfqRepo, id);

    if (id === "1") {
      throw new BadRequestError(`This is "SPECIAL" RFQ - you cannot edit it!`);
    }

    const rfq = await RfqRepo.updateData({
      id,
      eau,
      pm_id,
      name,
      samples_expected,
      mp_expected,
      for_valuation,
      req_disp_tech,
      req_disp_size,
      req_disp_res,
      req_disp_brigt,
      req_disp_angle,
      req_disp_od,
      req_disp_aa,
      req_disp_inter,
      req_disp_ot,
      req_disp_st,
      req_disp_spec,
      req_tp_size,
      req_tp_aa,
      req_tp_tech,
      req_tp_od,
      req_tp_inter,
      req_tp_glass,
      req_tp_spec,
      req_others,
      final_solutions,
    });

    if (existingRfq.for_valuation !== for_valuation) {
      const status = for_valuation ? "to do" : "privates";
      await ClickUp.updateStatus({ taskId: existingRfq.clickup_id, status });
    }

    res.status(200).send(rfq);
  }
);

export { router as updateRfqRouter };
