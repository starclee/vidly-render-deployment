const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

module.exports = function () {
  let dbString = config.get("db");
  mongoose
    .connect(dbString)
    .then(() => logger.info(`Connected to ${dbString} ...`));
};
