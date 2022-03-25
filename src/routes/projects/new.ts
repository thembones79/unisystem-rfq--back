import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ProjectRepo } from "../../repos/project-repo";
import { generateClientCode } from "../../services/clientCodeGenerator";

const router = express.Router();

const NUMBER_OF_TWO_LETTER_COMBINATIONS = 26 * 26;

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

project_code, // generate - get client code, find highest number, add 1, add zeros, concatenate
  project_client_id, // body
  industry_id, //body
  rfq_id, // conditional ???
  department, //body
  pm_id, //body
  clickup_id, //""
  version,
  "";
revision, "";
note, //body
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
      const { name } = req.body;

      const existingClient = await ProjectClientRepo.findByName(name);
      if (existingClient) {
        throw new BadRequestError("Client already exists", "name");
      }

      const code = await newClientCode(name);

      const newProject = await ProjectRepo.insert({
        name,
        code,
      });

      res.status(201).send(newClient);
    }
  );

export { router as newProjectRouter };
