import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { keys } from "../../config/keys";
import { spFileCreate } from "../../services/spFileCreate";
import { BadRequestError } from "../../errors";
import { RfqRepo } from "../../repos/rfq-repo";
import { UserRepo } from "../../repos/user-repo";
import { generateRfqCode } from "../../services/rfqNoGenerator";
import { ClickUp } from "../../services/clickup";

const router = express.Router();

router.post(
  "/rfqs",
  requireAuth,
  [
    body("eau")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a min EAU"),
    body("project_client_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a CustomerId"),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("You must supply a name for RFQ"),
    body("pm_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a PmId"),
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
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      eau,
      project_client_id,
      name,
      pm_id,
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
    } = req.body;

    const kam = await UserRepo.findById(kam_id);
    if (!kam) {
      throw new BadRequestError("KAM does not exist");
    }

    const pm = await UserRepo.findById(pm_id);
    if (!pm) {
      throw new BadRequestError("PM does not exist");
    }

    const pmEmail = pm.email as string;

    let rfq_code = generateNewRfqCode(project_client_id);
    let existingRfq = await RfqRepo.findByRfqCode(rfq_code);

    const rfqCodeWithExtraNote = extra_note
      ? `${rfq_code} ${extra_note}`
      : rfq_code;

    const clickupId = await ClickUp.createTask({
      pmEmail,
      code: rfqCodeWithExtraNote,
    });

    const rfq = await RfqRepo.insert({
      rfq_code,
      eau,
      customer_id,
      distributor_id,
      pm_id,
      kam_id,
      clickup_id: clickupId,
      final_solutions,
      conclusions,
      samples_expected,
      mp_expected,
      eau_max,
      extra_note,
      department,
    });

    //  await spFileCreate({ kam: kam.shortname, rfq_code });

    const pathModifier =
      process.env.NODE_ENV === "production" ? "" : "testing/";

    //const spPath = `${keys.SP_DOMAIN}/sites/ProjectsManagementGroup/Shared%20Documents/RIVERDI%20PROJECTS/${pathModifier}${kam.shortname}_!PROSPECTS/${rfq_code}`;

    const spPath = `Go to the app:`;

    const appPath = `${keys.CLIENT_ORIGIN}/rfqs/${rfq.id}`;

    const description = `

${spPath}

${appPath}

    `;

    await ClickUp.updateDescription({ taskId: clickupId, description });

    res.status(201).send(rfq);
  }
);

export { router as newRfqRouter };
