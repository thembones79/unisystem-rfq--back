import express from "express";
import { requireAuth } from "../../middlewares";
import { RfqRepo } from "../../repos/rfq-repo";

const router = express.Router();

router.get("/rfqs", requireAuth, async (req, res) => {
  const rfqs = await RfqRepo.find();
  res.send(rfqs);
});

export { router as rfqListRouter };
