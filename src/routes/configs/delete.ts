import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { ConfigRepo } from "../../repos/config-repo";

const router = express.Router();

router.delete("/configs/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  let existingConfig = await ConfigRepo.findById(id);
  if (!existingConfig) {
    throw new BadRequestError("Config does not exists");
  }

  await checkPermissions(req, ConfigRepo, id);

  const config = await ConfigRepo.delete(id);
  res.send(config);
});

export { router as deleteConfigRouter };
