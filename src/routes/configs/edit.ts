import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { ConfigRepo } from "../../repos/config-repo";

const router = express.Router();

router.put(
  "/configs/:id",
  requireAuth,
  [body("name").trim()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, template } = req.body;

    const { id } = req.params;

    const existingConfig = await ConfigRepo.findById(id);
    if (!existingConfig) {
      throw new BadRequestError("Config does not exist");
    }

    await checkPermissions(req, ConfigRepo, id);

    const config = await ConfigRepo.updateData({
      id,
      name,
      template,
    });

    res.status(200).send(config);
  }
);

export { router as updateConfigRouter };
