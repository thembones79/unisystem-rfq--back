import express from "express";

import {
  partnumberListRouter,
  newPartnumberRouter,
  updatePartnumberRouter,
  deletePartnumberRouter,
  showPartnumberRouter,
} from "./partnumbers";

const app = express();

app.use(partnumberListRouter);
app.use(newPartnumberRouter);
app.use(updatePartnumberRouter);
app.use(deletePartnumberRouter);
app.use(showPartnumberRouter);

export { app as partnumberRouter };
