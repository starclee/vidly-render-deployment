const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");

describe("Auth middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("Should return 401 if No token given", async () => {
    token = "";
    let res = await exec();
    expect(res.status).toBe(401);
  });

  it("Should return a 400 if token is invalid", async () => {
    token = "a";
    let res = await exec();
    expect(res.status).toBe(400);
  });

  it("Should return a 200 if token is a valid", async () => {
    let res = await exec();
    expect(res.status).toBe(200);
  });
});
