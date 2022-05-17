import express from "express";
import { requireAuth } from "../../middlewares";
import { UserRepo } from "../../repos/user-repo";

const router = express.Router();

router.get("/pms", requireAuth, async (req, res) => {
  const pms = await UserRepo.findPms();
  res.send(pms);
});

export { router as allPmsRouter };
