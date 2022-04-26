import express, { Request, Response } from "express";
import { body } from "express-validator";
import { spFileCreate } from "../../services/spFileCreate";
import { ClickUp } from "../../services/clickup";
import { validateRequest, requireAuth } from "../../middlewares";
import { ProjectRepo } from "../../repos/project-repo";
import { ProjectClientRepo } from "../../repos/project-client-repo";
import { RndTaskRepo } from "../../repos/rndtask-repo";
import { concatZeros } from "../../services/concatZeros";
import { UserRepo } from "../../repos/user-repo";
import { BadRequestError } from "../../errors";

const router = express.Router();

const newProjectCode = async (clientCode: string) => {
  const lastNumber = await ProjectRepo.findMaxNumberForGivenCode(clientCode);
  return clientCode + concatZeros(lastNumber + 1 + "", 3);
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

    const { project_code, clickup_id, kam_folder, client, department } =
      project;

    // get project clickup id

    // create clickup rnd task

    // link clickup rnd task with project task

    // create sharepoint space

    // generate serial

    // insert task into db

    // const pm = await UserRepo.findById(pm_id);
    // if (!pm) {
    //   throw new BadRequestError("PM does not exist");
    // }

    // const pmEmail = pm.email as string;

    //const client = await ProjectClientRepo.findById(project_client_id);
    // const clientCode = client.code as string;
    // const clientName = client.name as string;
    // const clientKam = client.kam as string;
    // const list = client.client_list_clickup_id as string;
    // const clientKamAlt = client.kam_alt as string;
    // const clientKamRole = client.kam_role as number;

    // {
    //   "name":"AAAA2",
    //    "description":"BBBBBB",
    //    "priority":"4" /// 1 - urgent 2 - high  3 - notmal, 4 - low
    // }

    //     {
    //       "name":"AAAA3",
    //        "description":"BBBBBB3",
    //        "priority":"4",
    //          "custom_fields": [
    //  {
    //    "id": "cf77643a-c356-4f71-b582-5cfe344278b1",
    //    "value": "DUP004"
    //  }
    // ]
    // }

    const rndtask_clickup_id = await ClickUp.createRndTask({
      name,
      description,
      priority,
      custom_fields: [
        {
          id: "cf77643a-c356-4f71-b582-5cfe344278b1",
          value: project_code,
        },
      ],
      tags: ["waiting_for_autobot"],
    });

    await ClickUp.linkTasks(rndtask_clickup_id, clickup_id);

    const newRndTask = await RndTaskRepo.insert({
      project_id: id,
      serial: "88",
      rndtask_clickup_id,
    });

    // await spFileCreate({
    //   projectCode: project_code,
    //   department,
    //   clientName,
    //   kam: clientKamAlt,
    // });

    res.status(201).send(newRndTask);
  }
);

export { router as newRndTaskRouter };
