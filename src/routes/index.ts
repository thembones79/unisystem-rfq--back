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

export { app as router };
