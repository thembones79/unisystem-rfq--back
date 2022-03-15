import request from "supertest";
import { app } from "../../../app";

it("responds with details about the current user", async () => {
  const cookie = await global.login();
  const response = await request(app)
    .get("/api/v1/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("michal@unisystem.pl");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/v1/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
