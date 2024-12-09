const express = require("express");
const winston = require("winston");
const app = express();

require("./startup/logging")();
require("./startup/config")(app);
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/prod")(app);

const portNo = process.env.PORT || 3000;
const server = app.listen(portNo, () => {
  winston.info("Listening on port " + portNo);
});

// testing purposes
// const server = app.listen(0);
// const port = server.address().port;
// (() => winston.info("Listening on port " + port))();

module.exports = server;
