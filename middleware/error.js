const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.error(`${err.message} - ${req.method} ${req.url}`, err);
  res.status(500).send("something failed");
};
