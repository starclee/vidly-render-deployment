const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should generate a valid JWT token", () => {
    let body = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    let user = new User(body);
    let token = user.generateAuthToken();

    const verify = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(verify).toMatchObject(body);
  });
});
