const whatsapp = require("./whatsapp");
const auth = require("./auth");
const ping = require("./ping");
const db = require("./db");

module.exports = {
  ...whatsapp,
  ...auth,
  ...ping,
  whatsapp,
  auth,
  ping,
  db,
};
