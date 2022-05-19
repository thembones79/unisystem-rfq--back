import express from "express";

import { blockKams, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { checkPermissions } from "../../services/checkPermissions";
import { PartnumberRepo } from "../../repos/partnumber-repo";

const router = express.Router();

router.delete("/partnumbers/:id", requireAuth, blockKams, async (req, res) => {
  const { id } = req.params;

  const existingPartnumber = await PartnumberRepo.findById(id);
  if (!existingPartnumber) {
    throw new BadRequestError(" does not exist");
  }

  await checkPermissions(req, PartnumberRepo, id);

  const deletedPartnumber = await PartnumberRepo.delete(id);
  res.send(deletedPartnumber);
});

export { router as deletePartnumberRouter };
