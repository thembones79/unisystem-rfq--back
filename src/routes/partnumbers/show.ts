import express from "express";
import { requireAuth } from "../../middlewares";
import { PartnumberRepo } from "../../repos/partnumber-repo";
import { checkPermissions } from "../../services/checkPermissions";
import { NotFoundError } from "../../errors";

const router = express.Router();

router.get("/partnumbers/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const partnumber = await PartnumberRepo.findById(id);

  if (!partnumber) {
    throw new NotFoundError();
  }

  await checkPermissions(req, PartnumberRepo, id);

  res.send(partnumber);
});

export { router as showPartnumberRouter };
