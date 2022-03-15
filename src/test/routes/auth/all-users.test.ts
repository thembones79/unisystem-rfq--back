import request from "supertest";
import { app } from "../../../app";

it("responds with users list", async () => {
  const cookie = await global.login(2);

  const response = await request(app)
    .get("/api/v1/users")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.length).toBeGreaterThan(0);
});

it("responds 401 if not authenticated", async () => {
  const response = await request(app).get("/api/v1/users").send().expect(401);
});
