import express from "express";

import {
  signupRouter,
  loginRouter,
  logoutRouter,
  currentUserRouter,
  allUsersRouter,
  allKamsRouter,
  allPmsRouter,
  showUserRouter,
  editUserRouter,
  changePasswordRouter,
  usersAndAdminsRouter,
  disableUserRouter,
  enableUserRouter,
} from "./auth";

const app = express();

app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(signupRouter);
app.use(allUsersRouter);
app.use(showUserRouter);
app.use(editUserRouter);
app.use(changePasswordRouter);
app.use(usersAndAdminsRouter);
app.use(disableUserRouter);
app.use(enableUserRouter);
app.use(allKamsRouter);
app.use(allPmsRouter);

export { app as userRouter };
