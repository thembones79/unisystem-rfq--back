import express from "express";

import {
  projectClientListRouter,
  newProjectClientRouter,
  updateProjectClientRouter,
  deleteProjectClientRouter,
  showProjectClientRouter,
} from "./project-clients";

const app = express();

app.use(projectClientListRouter);
app.use(newProjectClientRouter);
app.use(updateProjectClientRouter);
app.use(deleteProjectClientRouter);
app.use(showProjectClientRouter);

export { app as projectClientRouter };
