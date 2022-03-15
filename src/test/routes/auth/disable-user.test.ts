import request from "supertest";
import { app } from "../../../app";

it("removes userfrom user list", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      passwordConfirm: "password",
      username: "test",
      shortname: "QWERTY",
      role_id: 2,
    })
    .expect(201);

  const cookie = await global.login(1);

  const before = await request(app)
    .get("/api/v1/users")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(before.body.length).toEqual(1);

  await request(app)
    .post(`/api/v1/users/disable`)
    .set("Cookie", cookie)
    .send({
      id: 1,
    })
    .expect(200);

  const after = await request(app)
    .get("/api/v1/users")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(after.body.length).toEqual(0);
});

it("disallows disabled user from log in", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      passwordConfirm: "password",
      username: "test",
      shortname: "QWERTY",
      role_id: 2,
    })
    .expect(201);

  const cookie = await global.login(1);

  const response = await request(app)
    .get("/api/v1/users")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  await request(app)
    .post(`/api/v1/users/disable`)
    .set("Cookie", cookie)
    .send({
      id: response.body[0].id,
    })
    .expect(200);

  await request(app)
    .post("/api/v1/users/login")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});
