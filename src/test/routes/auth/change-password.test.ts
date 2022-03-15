import request from "supertest";
import { app } from "../../../app";

it("successfully changes password", async () => {
  const cookie = await global.login(1);
  const before = await request(app)
    .get("/api/v1/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  await request(app)
    .put(`/api/v1/users/${before.body.currentUser.id}/changepassword`)
    .set("Cookie", cookie)
    .send({
      password: "passwordpassword2",
      passwordConfirm: "passwordpassword2",
    })
    .expect(200);
});

it("responds 401 if request is not from admin", async () => {
  const cookie = await global.login(2);

  const response = await request(app)
    .put(`/api/v1/users/1/changepassword`)
    .set("Cookie", cookie)
    .send({
      password: "passwordpassword2",
      passwordConfirm: "passwordpassword2",
    })
    .expect(401);
});

it("responds 401 if not authenticated", async () => {
  const response = await request(app)
    .put(`/api/v1/users/1/changepassword`)
    .send({
      password: "passwordpassword2",
      passwordConfirm: "passwordpassword2",
    })
    .expect(401);
});
