import express from "express";
import { requireAuth } from "../../middlewares";
import { UserRepo } from "../../repos/user-repo";

const router = express.Router();

router.get("/users", requireAuth, async (req, res) => {
  const users = await UserRepo.find();
  res.send(users);
});

export { router as allUsersRouter };
