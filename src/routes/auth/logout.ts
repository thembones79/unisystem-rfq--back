import express from "express";
import { keys } from "../../config/keys";

const router = express.Router();

router.post("/users/logout", (req, res) => {
  req.session = null;
  res.redirect(keys.CLIENT_ORIGIN);
});

export { router as logoutRouter };
