import express from "express";
import { userRouter } from "./user-router";
import { rfqRouter } from "./rfq-router";
import { requirementRouter } from "./requirement-router";
import { customerRouter } from "./customer-router";
import { distributorRouter } from "./distributor-router";

const app = express();

app.use(userRouter);
app.use(rfqRouter);
app.use(requirementRouter);
app.use(customerRouter);
app.use(distributorRouter);

export { app as router };
