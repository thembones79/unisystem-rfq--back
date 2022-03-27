import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ProjectClientRepo } from "../../repos/project-client-repo";
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

router.post(
  "/clients",
  requireAuth,
  [
    body("name")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("You must supply a distributor name"),
    body("kam_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a KamId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, kam_id } = req.body;

    const existingClient = await ProjectClientRepo.findByName(name);
    if (existingClient) {
      throw new BadRequestError("Client already exists", "name");
    }

    const code = await newClientCode(name);

    const newClient = await ProjectClientRepo.insert({
      name,
      code,
      kam_id,
    });

    res.status(201).send(newClient);
  }
);

export { router as newProjectClientRouter };
