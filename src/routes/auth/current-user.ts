import express from "express";

const router = express.Router();

router.get("/users/currentuser", (req, res) => {
  console.log({ c2: req.currentUser });
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
