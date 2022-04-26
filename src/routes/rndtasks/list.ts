import express from "express";
import { requireAuth } from "../../middlewares";
import { RndTaskRepo } from "../../repos/rndtask-repo";
import { ClickUp } from "../../services/clickup";

const router = express.Router();

router.get("/projects/:id/tasks", requireAuth, async (req, res) => {
  const { id } = req.params;
  const tasks = await RndTaskRepo.findByProjectId(id);

  if (tasks) {
    const tasksWitchClickupData = tasks.map(async (x) => {
      const { serial, rndtask_clickup_id } = x;
      try {
        const { status, name } = await ClickUp.getTaskNameAndStatus(
          rndtask_clickup_id
        );

        return { serial, name, status, rndtask_clickup_id };
      } catch (error: any) {
        console.error({ error });
      }
    });

    res.send(tasksWitchClickupData);
  } else {
    res.send([]);
  }
});

export { router as rndTaskListRouter };
