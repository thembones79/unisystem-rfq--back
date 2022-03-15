import request from "supertest";
import { app } from "../../../app";

it("responds with rfqs list", async () => {
  const cookie = await global.login();

  await request(app)
    .post("/api/v1/rfqs")
    .set("Cookie", cookie)
    .send({
      eau: 2370000,
      customer_id: 1,
      distributor_id: 1,
      pm_id: 1,
      kam_id: 1,
      final_solutions: "final",
      conclusions: "my thoughts",
      samples_expected: "someday",
      mp_expected: "someday",
      eau_max: 3330000,
    })
    .expect(201);

  const response = await request(app)
    .get("/api/v1/rfqs")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.length).toBeGreaterThan(0);
});

it("responds 401 if not authenticated", async () => {
  const response = await request(app).get("/api/v1/rfqs").send().expect(401);
});
