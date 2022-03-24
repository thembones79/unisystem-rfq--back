import express from "express";

import {
  industryListRouter,
  newIndustryRouter,
  updateIndustryRouter,
  deleteIndustryRouter,
  showIndustryRouter,
} from "./industries";

const app = express();

app.use(industryListRouter);
app.use(newIndustryRouter);
app.use(updateIndustryRouter);
app.use(deleteIndustryRouter);
app.use(showIndustryRouter);

export { app as industryRouter };
