import express from "express";
import { userRouter } from "./user-router";
import { rfqRouter } from "./rfq-router";
import { requirementRouter } from "./requirement-router";
import { customerRouter } from "./customer-router";
import { distributorRouter } from "./distributor-router";
import { projectClientRouter } from "./project-client-router";
import { industryRouter } from "./industry-router";
import { projectRouter } from "./project-router";
import { partnumberRouter } from "./partnumber-router";
import { rndTaskRouter } from "./rndtask-router";
import { webhookRouter } from "./webhook-router";
import { erpxlProductRouter } from "./erpxl-product-router";
import { offerRouter } from "./offer-router";
import { configRouter } from "./config-router";

const app = express();

app.use(userRouter);
app.use(rfqRouter);
app.use(requirementRouter);
app.use(customerRouter);
app.use(distributorRouter);
app.use(projectClientRouter);
app.use(industryRouter);
app.use(projectRouter);
app.use(partnumberRouter);
app.use(rndTaskRouter);
app.use(webhookRouter);
app.use(erpxlProductRouter);
app.use(offerRouter);
app.use(configRouter);

export { app as router };
