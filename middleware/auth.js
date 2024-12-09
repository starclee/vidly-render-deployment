const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  let token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied! No token available");

  try {
    let decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send("invalid jwt token");
  }
}

module.exports = auth;
