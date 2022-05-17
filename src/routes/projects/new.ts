import express, { Request, Response } from "express";
import { body } from "express-validator";
import { spFileCreate } from "../../services/spFileCreate";
import { ClickUp } from "../../services/clickup";
import { validateRequest, requireAuth, blockKams } from "../../middlewares";
import { ProjectRepo } from "../../repos/project-repo";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { concatZeros } from "../../services/concatZeros";
import { UserRepo } from "../../repos/user-repo";
import { keys } from "../../config/keys";
import { BadRequestError } from "../../errors";

const router = express.Router();

const newProjectCode = async (clientCode: string) => {
  const lastNumber = await ProjectRepo.findMaxNumberForGivenCode(clientCode);
  return clientCode + concatZeros(lastNumber + 1 + "", 3);
};

router.post(
  "/projects",
  requireAuth,
  blockKams,
  [
    body("project_client_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a ClientId"),
    body("industry_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a IndustryId"),
    body("pm_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a PmId"),
    body("rfq_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a RfqId"),
    body("note").trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { project_client_id, industry_id, pm_id, note, rfq_id } = req.body;

    const pm = await UserRepo.findById(pm_id);
    if (!pm) {
      throw new BadRequestError("PM does not exist");
    }

    const pmEmail = pm.email as string;

    const client = await ProjectClientRepo.findById(project_client_id);
    const clientCode = client.code as string;
    const clientName = client.name as string;
    const clientKam = client.kam as string;
    const list = client.client_list_clickup_id as string;
    const clientKamAlt = client.kam_alt as string;
    const clientKamRole = client.kam_role as number;
    const project_code = await newProjectCode(clientCode);
    const department = clientKamRole === 4 ? "EX" : "PL";

    const sp = await spFileCreate({
      projectCode: project_code,
      department,
      clientName,
      kam: clientKamAlt,
    });

    const clickup_id = await ClickUp.createTask({
      pmEmail,
      code: `[${project_code}]`,
      status: "open",
      list,
    });

    const version = "";
    const revision = "";

    const newProject = await ProjectRepo.insert({
      project_code,
      project_client_id,
      industry_id,
      department,
      pm_id,
      note,
      rfq_id,
      clickup_id,
      version,
      revision,
    });

    const appPath = `${keys.CLIENT_ORIGIN}/projects/${newProject.id}`;

    const description = `

      ${encodeURI(sp)}

      ${appPath}

    `;

    await ClickUp.updateDescription({ taskId: clickup_id, description });

    res.status(201).send(newProject);
  }
);

export { router as newProjectRouter };
