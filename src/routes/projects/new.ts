import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ProjectRepo } from "../../repos/project-repo";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { generateClientCode } from "../../services/clientCodeGenerator";

const router = express.Router();

const newClientCode = async (name: string) => {
  const firstLetter = name.substring(0, 1).toUpperCase();
  const numberOfClients = await ProjectClientRepo.countByFirstLetter(
    firstLetter
  );

  if (numberOfClients === NUMBER_OF_TWO_LETTER_COMBINATIONS) {
    throw new BadRequestError(
      `
    All possible combinations were used!
    You cannot add more customers whose name starts with letter ${firstLetter}
    `,
      "name"
    );
  }

  let clientCode = generateClientCode(name);
  let isCodeExist = await ProjectClientRepo.findByCode(clientCode);

  while (isCodeExist) {
    clientCode = generateClientCode(name);
    isCodeExist = await ProjectClientRepo.findByCode(clientCode);
  }

  return clientCode;
};

////// project_code, // generate - get client code, find highest number, add 1, add zeros, concatenate

router.post(
  "/projects",
  requireAuth,
  [
    body("name")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("You must supply a distributor name"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { project_client_id, industry_id, department, pm_id, note, rfq_id } =
      req.body;

    const client = await ProjectClientRepo.findById(project_client_id);
    const clientCode = client.code as string;

    const lastNumber = await ProjectRepo.findMaxNumberForGivenCode(clientCode);

    const clickup_id = "";
    const version = "";
    const revision = "";

    const project_code = "######";

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
