const morgan = require("morgan");
const config = require("config");

module.exports = function (app) {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR! : jwtPrivateKey is not defined");
  }
  //$env:NODE_ENV="development"
  if (app.get("env") === "development") {
    app.use(morgan("short")); // for short logging purpose in the console
  }
};
