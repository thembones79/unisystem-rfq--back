import request from "supertest";
import { app } from "../../../app";

it("responds with rfq details", async () => {
  const cookie = await global.login();

  const newRfq = await request(app)
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
    .get(`/api/v1/rfqs/${newRfq.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);
});

it("responds with 404 if rfq not found", async () => {
  const cookie = await global.login();

  const response = await request(app)
    .get(`/api/v1/rfqs/1`)
    .set("Cookie", cookie)
    .send()
    .expect(404);
});

it("responds 401 if not authenticated", async () => {
  const response = await request(app).get("/api/v1/rfqs/4").send().expect(401);
});
