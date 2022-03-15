import express from "express";
import { requireAuth } from "../../middlewares";
import { UserRepo } from "../../repos/user-repo";
import { NotFoundError } from "../../errors";

const router = express.Router();

router.get("/users/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const user = await UserRepo.findById(id);

  if (!user) {
    throw new NotFoundError();
  }

  res.send(user);
});

export { router as showUserRouter };
