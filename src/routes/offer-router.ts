import express from "express";

import {
  newOfferRouter,
  offerListRouter,
  showOfferRouter,
  updateOfferRouter,
  deleteOfferRouter,
} from "./offers";

const app = express();

app.use(newOfferRouter);
app.use(offerListRouter);
app.use(showOfferRouter);
app.use(updateOfferRouter);
app.use(deleteOfferRouter);

export { app as offerRouter };
