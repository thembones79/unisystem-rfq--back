import express from "express";
import { requireAuth } from "../../middlewares";
import { PartnumberRepo } from "../../repos/partnumber-repo";
import { NotFoundError } from "../../errors";

const router = express.Router();

router.get("/projects/:id/partnumbers", requireAuth, async (req, res) => {
  const { id } = req.params;
  const partnumbers = await PartnumberRepo.findByProjectId(id);

  if (!partnumbers) {
    throw new NotFoundError();
  }

  res.send(partnumbers);
});

export { router as showPartnumbersForProjectRouter };
