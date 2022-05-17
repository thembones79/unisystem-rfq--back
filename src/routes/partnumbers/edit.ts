import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { PartnumberRepo } from "../../repos/partnumber-repo";

const router = express.Router();

router.put(
  "/partnumbers/:id",
  requireAuth,
  [body("note").trim(), body("version").trim(), body("revision").trim()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { note, version, revision } = req.body;
    const { id } = req.params;

    const existingPn = await PartnumberRepo.findById(id);
    if (!existingPn) {
      throw new BadRequestError("Partnumber does not exist");
    }

    await checkPermissions(req, PartnumberRepo, id);

    const updatedPartnumber = await PartnumberRepo.updateData({
      id,
      note,
      version,
      revision,
    });

    res.status(200).send(updatedPartnumber);
  }
);

export { router as updatePartnumberRouter };
