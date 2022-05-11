import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { keys } from "../../config/keys";
import { spFileCreate } from "../../services/spFileCreate";
import { BadRequestError } from "../../errors";
import { RfqRepo } from "../../repos/rfq-repo";
import { UserRepo } from "../../repos/user-repo";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { concatZeros } from "../../services/concatZeros";
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
      .withMessage("You must supply a EAU"),
    body("project_client_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a CustomerId"),
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
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      eau,
      project_client_id,
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
    } = req.body;

    const pm_id = "4"; // Jacek

    const pm = await UserRepo.findById(pm_id);
    if (!pm) {
      throw new BadRequestError("PM does not exist");
    }

    const client = await ProjectClientRepo.findById(project_client_id);
    if (!client) {
      throw new BadRequestError("Client does not exist");
    }

    const clientKamRole = client.kam_role as number;
    const department = clientKamRole === 4 ? "EX" : "PL";
    const clientName = client.name;
    const kam = client.kam_alt;
    const year = new Date().getFullYear();
    const serial =
      (await RfqRepo.findMaxSerialForDeptAndYear({
        department,
        year,
      })) + 1;

    const pmEmail = pm.email as string;

    const rfq_code = `RFQ${department}/${year}/${concatZeros(serial + "", 3)}`;

    const sp = await spFileCreate({
      projectCode: rfq_code,
      department,
      clientName,
      kam,
    });

    const status = for_valuation ? "to do" : "privates";

    console.log({ bool: true, txt: "false", for_valuation });
    console.log({ department, year, serial, rfq_code });

    const clickup_id = await ClickUp.createTask({
      pmEmail,
      code: `[${rfq_code}] ${name}`,
      status,
    });

    const rfq = await RfqRepo.insert({
      rfq_code,
      clickup_id,
      sp: encodeURI(sp),
      year,
      serial,
      department,
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
    });

    const appPath = `${keys.CLIENT_ORIGIN}/rfqs/${rfq.id}`;

    const description = `

${sp}

${appPath}

    `;

    await ClickUp.updateDescription({ taskId: clickup_id, description });

    res.status(201).send(rfq);
  }
);

export { router as newRfqRouter };
