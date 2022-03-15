import express from "express";

import {
  distributorListRouter,
  newDistributorRouter,
  updateDistributorRouter,
  deleteDistributorRouter,
  showDistributorRouter,
} from "./distributors";

const app = express();

app.use(distributorListRouter);
app.use(newDistributorRouter);
app.use(updateDistributorRouter);
app.use(deleteDistributorRouter);
app.use(showDistributorRouter);

export { app as distributorRouter };
