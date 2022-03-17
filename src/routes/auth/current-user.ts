import express from "express";

const router = express.Router();

router.get("/users/currentuser", (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
