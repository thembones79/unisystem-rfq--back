import express from "express";

import { customerListRouter } from "./customers";

const app = express();

app.use(customerListRouter);

export { app as customerRouter };
