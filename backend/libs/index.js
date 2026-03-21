const whatsapp = require("./whatsapp");
const auth = require("./auth");
const ping = require("./ping");
const model = require("../model");

module.exports = {
  ...whatsapp,
  ...auth,
  ...ping,
  whatsapp,
  auth,
  ping,
  db: model,
};
