import express from "express";
import { requireAuth } from "../../middlewares";
import { ConfigRepo } from "../../repos/config-repo";
import { NotFoundError, BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";

const router = express.Router();

router.get("/configs/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const config = await ConfigRepo.findById(id);

  if (!config) {
    throw new NotFoundError();
  }

  await checkPermissions(req, ConfigRepo, id);

  res.send(config);
});

export { router as showConfigRouter };
