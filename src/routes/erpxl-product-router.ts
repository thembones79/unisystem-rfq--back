import express from "express";

import { erpxlProductListRouter } from "./erpxl-products";

const app = express();

app.use(erpxlProductListRouter);

export { app as erpxlProductRouter };
