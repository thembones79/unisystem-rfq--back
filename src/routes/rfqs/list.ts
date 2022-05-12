import express from "express";
import { requireAuth } from "../../middlewares";
import { RfqRepo } from "../../repos/rfq-repo";
import { listData } from "../../services/listData";

const router = express.Router();

router.get("/rfqs", requireAuth, async (req, res) => {
  const rfqs = await listData(req, RfqRepo);

  console.log(rfqs);
  res.send(rfqs);
});

export { router as rfqListRouter };
