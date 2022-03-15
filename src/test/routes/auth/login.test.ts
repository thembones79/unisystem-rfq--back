import request from "supertest";
import { app } from "../../../app";

it("fails when a email that does not exist us supplied", async () => {
  return request(app)
    .post("/api/v1/users/login")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      passwordConfirm: "password",
      username: "test",
      shortname: "QWERTY",
      role_id: 1,
    })
    .expect(201);

  await request(app)
    .post("/api/v1/users/login")
    .send({
      email: "test@test.com",
      password: "passwo",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      passwordConfirm: "password",
      username: "test",
      shortname: "QWERTY",
      role_id: 1,
    })
    .expect(201);

  const response = await request(app)
    .post("/api/v1/users/login")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
