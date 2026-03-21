const config = require("../config");

module.exports = {
  OTP: config.WA_TEMPLATE_OTP,
  MONITOR_CREATED: config.WA_TEMPLATE_MONITOR_CREATED,
  SITE_DOWN: config.WA_TEMPLATE_SITE_DOWN,
  SITE_RECOVERED: config.WA_TEMPLATE_SITE_RECOVERED,
};
