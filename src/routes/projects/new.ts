import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { ProjectRepo } from "../../repos/project-repo";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { concatZeros } from "../../services/concatZeros";

const router = express.Router();

const newProjectCode = async (clientId: string) => {
  const client = await ProjectClientRepo.findById(clientId);
  const clientCode = client.code as string;
  const lastNumber = await ProjectRepo.findMaxNumberForGivenCode(clientCode);
  return clientCode + concatZeros(lastNumber + 1 + "", 3);
};

router.post(
  "/projects",
  requireAuth,
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
    body("department")
      .notEmpty()
      .trim()
      .withMessage("You must supply a Department"),
    body("note").trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { project_client_id, industry_id, department, pm_id, note, rfq_id } =
      req.body;

    const project_code = await newProjectCode(project_client_id);

    const clickup_id = "";
    const version = "";
    const revision = "";
    console.log({ project_client_id });
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

    res.status(201).send(newProject);
  }
);

export { router as newProjectRouter };
