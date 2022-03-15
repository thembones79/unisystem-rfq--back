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

  await request(app)
    .post(`/api/v1/requirements`)
    .set("Cookie", cookie)
    .send({
      rfq_id: newRfq.body.id,
      c_nc_cwr: "c",
      requirement: "new req",
      note: "new note",
      priority: 0,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/v1/rfqs/${newRfq.body.id}/requirements`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body[0].note).toEqual("new note");
});

it("responds 401 if not authenticated", async () => {
  await request(app).get("/api/v1/rfqs/4/requirements").send().expect(401);
});
