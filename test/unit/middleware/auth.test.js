const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");
describe("Auth Middleware unit test for req.user", () => {
  it("should return the req.user payload ", () => {
    let user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    let token = new User(user).generateAuthToken();
    let req = {
      header: jest.fn().mockReturnValue(token),
    };
    let res = {};
    let next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
