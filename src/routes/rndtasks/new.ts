import express, { Request, Response } from "express";
import { body } from "express-validator";
import { spFileCreate } from "../../services/spFileCreate";
import { ClickUp } from "../../services/clickup";
import { validateRequest, requireAuth } from "../../middlewares";
import { ProjectRepo } from "../../repos/project-repo";
import { RndTaskRepo } from "../../repos/rndtask-repo";
import { concatZeros } from "../../services/concatZeros";
import { keys } from "../../config/keys";
import { BadRequestError } from "../../errors";

const router = express.Router();

const newSerialNumber = async (projectId: string) => {
  const currentMax = await RndTaskRepo.findMaxSerialForGivenProjectId(
    projectId
  );
  return currentMax + 1 + "";
};

router.post(
  "/projects/:id/tasks",
  requireAuth,
  [
    body("name").trim().notEmpty().withMessage("You must supply a name"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("You must supply a description"),
    body("priority")
      .trim()
      .notEmpty()
      .withMessage("You must supply a priotity"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, description, priority } = req.body;
    const { id } = req.params;
    const project = await ProjectRepo.findById(id);
    if (!project) {
      throw new BadRequestError("Project does not exist");
    }

    const serial = await newSerialNumber(id);

    const { project_code, clickup_id, kam_folder, client, department } =
      project;

    const rndTaskFolder = `${project_code}/RND.TASK.${concatZeros(serial, 2)}`;

    const sp = await spFileCreate({
      projectCode: rndTaskFolder,
      department,
      clientName: client,
      kam: kam_folder,
    });

    const appPath = `${keys.CLIENT_ORIGIN}/projects/${id}`;

    const descriptionPrefix = `

      ${encodeURI(sp)}

      ${appPath}

    `;

    const rndtask_clickup_id = await ClickUp.createRndTask({
      name,
      description: descriptionPrefix + description,
      priority,
      custom_fields: [
        {
          id: "cf77643a-c356-4f71-b582-5cfe344278b1",
          value: project_code,
        },
      ],
      tags: ["added_to_svn"],
    });

    await ClickUp.linkTasks(rndtask_clickup_id, clickup_id);

    const newRndTask = await RndTaskRepo.insert({
      project_id: id,
      serial,
      rndtask_clickup_id,
      sp,
    });

    res.status(201).send(newRndTask);
  }
);

export { router as newRndTaskRouter };
