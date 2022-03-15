import request from "supertest";
import { app } from "../../../app";
import { UserRepo } from "../../../repos/user-repo";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "passwordpassword",
      passwordConfirm: "passwordpassword",
      username: "test",
      shortname: "QWERTY",
      role_id: 1,
    })
    .expect(201);
});

it("creates a user", async () => {
  const startingCount = await UserRepo.count();
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "passwordpassword",
      passwordConfirm: "passwordpassword",
      username: "test",
      shortname: "QWERTY",
      role_id: 1,
    })
    .expect(201);

  const finishCount = await UserRepo.count();
  expect(finishCount - startingCount).toEqual(1);
});

it("returns a 400 with invalid email", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@tes@@t.com",
      password: "password",
      passwordConfirm: "password",
      username: "test",
      shortname: "QWERTY",
      role_id: 1,
    })
    .expect(400);
});

it("returns a 400 with invalid password", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      username: "testtest",
      password: "pa",
      passwordConfirm: "password",
      shortname: "QWERTY",
      role_id: 1,
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  return request(app).post("/api/v1/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
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
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      passwordConfirm: "password",
      username: "test",
      shortname: "QWERTY",
      role_id: 1,
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
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

  expect(response.get("Set-Cookie")).toBeDefined();
});
