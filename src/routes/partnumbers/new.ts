import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { buildSpProjectPath } from "../../services/buildSpProjectPath";
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
  startCount?: number;
}

const generatePartnumber = ({
  projectCode,
  size,
  display,
  touch,
  mechanics,
}: IGeneratePartnumber) =>
  `UC${size}${display}${touch}${mechanics}-${projectCode}V`;

const generateVersionedPartnumber = async ({
  projectCode,
  size,
  display,
  touch,
  mechanics,
  startCount,
}: IGeneratePartnumber): Promise<string> => {
  const count = startCount || 1;

  const partnumber =
    generatePartnumber({
      projectCode,
      size,
      display,
      touch,
      mechanics,
    }) + count;

  const existingPn = await PartnumberRepo.findByPartnumber(partnumber);
  if (existingPn) {
    return await generateVersionedPartnumber({
      projectCode,
      size,
      display,
      touch,
      mechanics,
      startCount: count + 1,
    });
  }

  return partnumber;
};

router.post(
  "/partnumbers",
  requireAuth,
  [
    body("project_id").trim(),
    body("size").trim(),
    body("display").trim(),
    body("touch").trim(),
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

    const spProjectPath = buildSpProjectPath(existingProject);
    const projectCode = existingProject.project_code;
    const thirdPartyPn =
      third_party_pn && `${third_party_pn} (for ${projectCode})`;
    const pn =
      thirdPartyPn ||
      (await generateVersionedPartnumber({
        projectCode,
        size,
        display,
        touch,
        mechanics,
      }));

    const existingPn = await PartnumberRepo.findByPartnumber(pn);
    if (existingPn) {
      throw new BadRequestError(`Partnumber ${pn} already exists!`);
    }

    const sharepoint = new Sharepoint();

    const sharepointResponse = await sharepoint.copyTO(
      `${spProjectPath}/${pn}`
    );

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
