import express from "express";

import { ClickupWebhookRouter } from "./webhooks";

const app = express();

app.use(ClickupWebhookRouter);

export { app as webhookRouter };
