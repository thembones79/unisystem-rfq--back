import express from "express";

const router = express.Router();

router.post("/users/logout", (req, res) => {
  req.session = null;
  res.send({});
});

export { router as logoutRouter };
