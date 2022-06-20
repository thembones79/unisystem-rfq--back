import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { UserRepo } from "../../repos/user-repo";
import { generateClientCode } from "../../services/clientCodeGenerator";
import { ClickUp } from "../../services/clickup";

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

    const kam = await UserRepo.findById(kam_id);
    const listId = await ClickUp.createList({
      listName: name,
      folderId: kam.kam_folder_clickup_id,
    });

    const code = await newClientCode(name);

    console.log({ name, code, kam_id, listId, iii: kam.kam_folder_clickup_id });

    const newClient = await ProjectClientRepo.insert({
      name,
      code,
      kam_id,
      client_list_clickup_id: listId,
    });

    res.status(201).send(newClient);
  }
);

export { router as newProjectClientRouter };
