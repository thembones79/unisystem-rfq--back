import express from "express";

import {
  rndTaskListRouter,
  newRndTaskRouter,
  deleteProjectRouter,
} from "./rndtasks";

const app = express();

app.use(rndTaskListRouter);
app.use(newRndTaskRouter);
app.use(deleteProjectRouter);

export { app as rndTaskRouter };
