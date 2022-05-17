import express from "express";
import { requireAuth } from "../../middlewares";
import { PartnumberRepo } from "../../repos/partnumber-repo";
import { getAllowedData } from "../../services/getAllowedData";

const router = express.Router();

router.get("/partnumbers", requireAuth, async (req, res) => {
  const partnumbers = await getAllowedData(req, PartnumberRepo);
  res.send(partnumbers);
});

export { router as partnumberListRouter };
