import express from "express";

import {
  projectListRouter,
  newProjectRouter,
  updateProjectRouter,
  deleteProjectRouter,
  showProjectRouter,
} from "./projects";

const app = express();

app.use(projectListRouter);
app.use(newProjectRouter);
app.use(updateProjectRouter);
app.use(deleteProjectRouter);
app.use(showProjectRouter);

export { app as projectRouter };
