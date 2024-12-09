const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, userValidation } = require("../models/user");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  res.send(user);
});

router.post("/", async (req, res) => {
  let error = userValidation(req.body);
  if (error)
    return res.status(400).send({
      message: error?.details?.[0]?.message,
    });

  let user = await User.findOne({ email: req.body.email }); //check unique email
  if (user)
    return res.status(400).send({
      message: "User already registered",
    });

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(user.password, salt);
  user.password = hashed;

  console.log(user.password);
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
