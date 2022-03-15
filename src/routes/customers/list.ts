import express from "express";
import { requireAuth } from "../../middlewares";
import { CustomerRepo } from "../../repos/customer-repo";

const router = express.Router();

router.get("/customers", requireAuth, async (req, res) => {
  const users = await CustomerRepo.find();
  res.send(users);
});

export { router as customerListRouter };
