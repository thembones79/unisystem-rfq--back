import express from "express";
import { requireAuth } from "../../middlewares";
import { UserRepo } from "../../repos/user-repo";

const router = express.Router();

router.get("/kams", requireAuth, async (req, res) => {
  const kams = await UserRepo.findKams();
  res.send(kams);
});

export { router as allKamsRouter };
