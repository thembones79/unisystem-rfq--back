import express from "express";
import { requireAuth } from "../../middlewares";
import { PartnumberRepo } from "../../repos/partnumber-repo";

const router = express.Router();

router.get("/partnumbers", requireAuth, async (req, res) => {
  const partnumbers = await PartnumberRepo.find();
  res.send(partnumbers);
});

export { router as partnumberListRouter };
