import request from "supertest";
import { app } from "../../../app";
import { RfqRepo } from "../../../repos/rfq-repo";

it("creates a rfq", async () => {
  const cookie = await global.login();
  const startingCount = await RfqRepo.count();
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

  const finishCount = await RfqRepo.count();
  expect(finishCount - startingCount).toEqual(1);
});

it("returns a 400 with invalid eau", async () => {
  const cookie = await global.login();
  await request(app)
    .post("/api/v1/rfqs")
    .set("Cookie", cookie)
    .send({
      eau: "ffhfhfh",
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
    .expect(400);
});

it("returns a 400 with invalid customer_id", async () => {
  const cookie = await global.login();
  await request(app)
    .post("/api/v1/rfqs")
    .set("Cookie", cookie)
    .send({
      eau: 4566700,
      customer_id: 1000000000,
      distributor_id: 1,
      pm_id: 1,
      kam_id: 1,
      final_solutions: "final",
      conclusions: "my thoughts",
      samples_expected: "someday",
      mp_expected: "someday",
      eau_max: 3330000,
    })
    .expect(400);
});

it("returns a 400 not provided customer_id", async () => {
  const cookie = await global.login();
  await request(app)
    .post("/api/v1/rfqs")
    .set("Cookie", cookie)
    .send({
      eau: 4566700,
      distributor_id: 1,
      pm_id: 1,
      kam_id: 1,
      final_solutions: "final",
      conclusions: "my thoughts",
      samples_expected: "someday",
      mp_expected: "someday",
      eau_max: 3330000,
    })
    .expect(400);
});

it("responds 401 if not authenticated", async () => {
  const response = await request(app)
    .post("/api/v1/rfqs")
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
    .expect(401);
});
