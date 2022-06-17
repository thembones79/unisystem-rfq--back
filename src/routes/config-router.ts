import express from "express";

import {
  newConfigRouter,
  configListRouter,
  showConfigRouter,
  updateConfigRouter,
  deleteConfigRouter,
} from "./configs";

const app = express();

app.use(newConfigRouter);
app.use(configListRouter);
app.use(showConfigRouter);
app.use(updateConfigRouter);
app.use(deleteConfigRouter);

export { app as configRouter };
