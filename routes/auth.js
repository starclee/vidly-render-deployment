const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  let { error } = validate(req.body);
  if (error)
    return res.status(400).send({ message: error?.details?.[0]?.message });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).send({ message: "Invalid user credentials" });

  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid)
    return res.status(401).send({ message: "Invalid user credentials" });

  let token = user.generateAuthToken();

  res.send({ message: "Access granted", token });
});

function validate(req) {
  let schema = new Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
  });

  return schema.validate(req);
}

module.exports = router;
