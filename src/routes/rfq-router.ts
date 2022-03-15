import express from "express";

import {
  newRfqRouter,
  rfqListRouter,
  showRfqRouter,
  updateRfqRouter,
  deleteRfqRouter,
} from "./rfqs";

const app = express();

app.use(newRfqRouter);
app.use(rfqListRouter);
app.use(showRfqRouter);
app.use(updateRfqRouter);
app.use(deleteRfqRouter);

export { app as rfqRouter };
