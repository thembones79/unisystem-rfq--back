import express from "express";

import {
  newRequirementRouter,
  showRequirementsForRfqRouter,
  updateRequirementRouter,
  deleteRequirementRouter,
  allRequirementsListRouter,
} from "./requirements";

const app = express();

app.use(newRequirementRouter);
app.use(showRequirementsForRfqRouter);
app.use(updateRequirementRouter);
app.use(deleteRequirementRouter);
app.use(allRequirementsListRouter);

export { app as requirementRouter };
