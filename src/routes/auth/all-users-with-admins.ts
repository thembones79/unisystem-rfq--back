import express from "express";
import { requireAuth } from "../../middlewares";
import { NotAuthorizedError } from "../../errors";
import { UserRepo } from "../../repos/user-repo";

const router = express.Router();

router.get("/usersandadmins", requireAuth, async (req, res) => {
  if (req.currentUser?.role_id !== 1) {
    throw new NotAuthorizedError();
  }

  const users = await UserRepo.findWithAdmins();
  res.send(users);
});

export { router as usersAndAdminsRouter };
