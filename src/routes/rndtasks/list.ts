import express from "express";
import { requireAuth } from "../../middlewares";
import { RndTaskRepo } from "../../repos/rndtask-repo";
import { ClickUp } from "../../services/clickup";

const router = express.Router();

router.get("/projects/:id/tasks", requireAuth, async (req, res) => {
  const { id } = req.params;
  const tasks = await RndTaskRepo.findByProjectId(id);

  if (tasks) {
    const tasksWitchClickupData = async () => {
      return await Promise.all(
        tasks.map(async (x) => {
          const { serial, rndtask_clickup_id, sp, project_id } = x;

          let name = "💩 task removed from ClickUp";
          let status = "DEAD 💀";

          try {
            const response = await ClickUp.getTaskNameAndStatus(
              rndtask_clickup_id
            );

            name = response.name;
            status = response.status;
          } catch (error: any) {
            console.error({ error });
          }

          return await {
            serial,
            name,
            status,
            rndtask_clickup_id,
            sp: encodeURI(sp),
            project_id,
          };
        })
      );
    };

    const response = await tasksWitchClickupData();

    res.send(response);
  } else {
    res.send([]);
  }
});

export { router as rndTaskListRouter };
