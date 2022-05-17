import express from "express";
import { requireAuth } from "../../middlewares";
import { RfqRepo } from "../../repos/rfq-repo";
import { getAllowedData } from "../../services/getAllowedData";

const router = express.Router();

router.get("/rfqs", requireAuth, async (req, res) => {
  const rfqs = await getAllowedData(req, RfqRepo);

  res.send(rfqs);
});

export { router as rfqListRouter };
