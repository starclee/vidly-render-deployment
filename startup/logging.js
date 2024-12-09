require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = () => {
  // process.on("uncaughtException", (ex) => {
  //   console.log("uncaughtException occurred");
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  // process.on("unhandledRejection", (ex) => {
  //   console.log("unhandledRejection occurred");
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  winston.exceptions.handle(
    new winston.transports.File({
      filename: "unCaughtException.log",
    }),
    new winston.transports.Console()
  );

  winston.rejections.handle(
    new winston.transports.File({
      filename: "unhandledRejection.log",
    }),
    new winston.transports.Console()
  );

  // winston transport setup (error,warn,info,verbose,debug,silly)
  winston.add(new winston.transports.File({ filename: "logFile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "info", // error,warn,info will be logged
    })
  );

  // throw new Error("uncaughtException occurred in the startup process");
  // Promise.reject( new Error("unhandledRejection occurred in the startup process"));
};
