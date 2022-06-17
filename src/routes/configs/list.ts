import express from "express";
import { requireAuth } from "../../middlewares";
import { ConfigRepo } from "../../repos/config-repo";
import { getAllowedData } from "../../services/getAllowedData";

const router = express.Router();

router.get("/configs", requireAuth, async (req, res) => {
  const configs = await getAllowedData(req, ConfigRepo);

  res.send(configs);
});

export { router as configListRouter };
