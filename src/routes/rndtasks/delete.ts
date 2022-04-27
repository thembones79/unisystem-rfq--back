import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { RndTaskRepo } from "../../repos/rndtask-repo";

const router = express.Router();

router.delete("/projects/:id/tasks/:serial", requireAuth, async (req, res) => {
  const { id, serial } = req.params;

  const existingTask = await RndTaskRepo.findByProjectIdAndSerial({
    serial,
    project_id: id,
  });
  if (!existingTask) {
    throw new BadRequestError("Task does not exist");
  }

  const deletedTask = await RndTaskRepo.delete({ serial, project_id: id });
  res.send(deletedTask);
});

export { router as deleteProjectRouter };
