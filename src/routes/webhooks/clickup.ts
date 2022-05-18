import express, { Request, Response } from "express";

const router = express.Router();

router.post("/webhook", async (req: Request, res: Response) => {
  const { body } = req;
  console.log(body);
  res.status(200).send(body);
});

export { router as ClickupWebhookRouter };
