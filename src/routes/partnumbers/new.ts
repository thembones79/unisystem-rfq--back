import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { Sharepoint } from "../../services/sharepoint";
import { PartnumberRepo } from "../../repos/partnumber-repo";
import { ProjectRepo } from "../../repos/project-repo";
import { BadRequestError } from "../../errors";

const router = express.Router();

interface IGeneratePartnumber {
  projectCode: string;
  size: string;
  display: string;
  touch: string;
  mechanics: string;
  thirdPartyPn: string;
}

const generatePartnumber = async ({
  projectCode,
  size,
  display,
  touch,
  mechanics,
  thirdPartyPn,
}: IGeneratePartnumber) =>
  thirdPartyPn || `UC${size}${display}${touch}${mechanics}-${projectCode}`;

router.post(
  "/partnumbers",
  requireAuth,
  [
    body("project_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a ProjectId"),
    body("size").trim().notEmpty().withMessage("You must supply a size"),
    body("display").trim().notEmpty().withMessage("You must supply a display"),
    body("touch").trim().notEmpty().withMessage("You must supply a touch"),
    body("mechanics").trim(),
    body("note").trim(),
    body("third_party_pn").trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      project_id,
      size,
      display,
      touch,
      mechanics,
      note,
      third_party_pn,
    } = req.body;

    const existingProject = await ProjectRepo.findById(project_id);
    if (!existingProject) {
      throw new BadRequestError("Project does not exist");
    }

    const projectCode = existingProject.project_code;

    const pn = await generatePartnumber({
      projectCode,
      size,
      display,
      touch,
      mechanics,
      thirdPartyPn: third_party_pn,
    });

    const existingPn = await PartnumberRepo.findByPartnumber(pn);
    if (existingPn) {
      throw new BadRequestError(`Partnumber ${pn} already exists!`);
    }

    const sharepoint = new Sharepoint();
    const sharepointResponse = await sharepoint.copyTO("folderName");
    console.log(sharepointResponse);

    const version = "";
    const revision = "";

    const newPn = await PartnumberRepo.insert({
      pn,
      project_id,
      version,
      revision,
      note,
    });

    res.status(201).send(newPn);
  }
);

export { router as newPartnumberRouter };
