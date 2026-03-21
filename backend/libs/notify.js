const wa = require("./whatsapp");
const tg = require("./telegram");
const { sendEmail } = require("../utils/sendEmail");
const emailTpl = require("../template/email");

function off(v) {
  return v === false || v === 0 || v === "0";
}

function on(v) {
  return v === true || v === 1 || v === "1";
}

/** WhatsApp alerts default on; opt out with alert_whatsapp false. */
function wantWhatsApp(user) {
  if (off(user.alert_whatsapp)) return false;
  return !!user.whatsapp;
}

/** Telegram / email alerts default off; enable in notification preferences. */
function wantTelegram(user) {
  if (!on(user.alert_telegram)) return false;
  return !!user.telegram_chat_id;
}

function wantEmail(user) {
  if (!on(user.alert_email)) return false;
  return !!user.email;
}

async function sendMonitorCreated(user, monitorName, displayUrl, intervalMins) {
  if (wantWhatsApp(user)) {
    await wa.sendMonitorCreated(
      user.whatsapp,
      user.name,
      monitorName,
      displayUrl,
      intervalMins,
    );
  }
  if (wantTelegram(user)) {
    await tg.sendMonitorCreated(
      user.telegram_chat_id,
      user.name,
      monitorName,
      displayUrl,
      intervalMins,
    );
  }
  if (wantEmail(user)) {
    await sendEmail(
      user.email,
      `Monitor created: ${monitorName}`,
      emailTpl.monitorCreated(user.name, monitorName, displayUrl, intervalMins),
    );
  }
}

async function sendSiteDown(user, monitor, errorMsg, timeStr) {
  if (wantWhatsApp(user)) {
    await wa.sendSiteDown(
      user.whatsapp,
      user.name,
      monitor.name,
      monitor.url,
      errorMsg,
      timeStr,
    );
  }
  if (wantTelegram(user)) {
    await tg.sendSiteDown(
      user.telegram_chat_id,
      user.name,
      monitor.name,
      monitor.url,
      errorMsg,
      timeStr,
    );
  }
  if (wantEmail(user)) {
    await sendEmail(
      user.email,
      `Down: ${monitor.name}`,
      emailTpl.siteDown(
        user.name,
        monitor.name,
        monitor.url,
        errorMsg,
        timeStr,
      ),
    );
  }
}

async function sendSiteRecovered(user, monitor, responseTime, downtimeDuration) {
  if (wantWhatsApp(user)) {
    await wa.sendSiteRecovered(
      user.whatsapp,
      user.name,
      monitor.name,
      monitor.url,
      responseTime,
      downtimeDuration,
    );
  }
  if (wantTelegram(user)) {
    await tg.sendSiteRecovered(
      user.telegram_chat_id,
      user.name,
      monitor.name,
      monitor.url,
      responseTime,
      downtimeDuration,
    );
  }
  if (wantEmail(user)) {
    await sendEmail(
      user.email,
      `Recovered: ${monitor.name}`,
      emailTpl.siteRecovered(
        user.name,
        monitor.name,
        monitor.url,
        responseTime,
        downtimeDuration,
      ),
    );
  }
}

module.exports = {
  sendMonitorCreated,
  sendSiteDown,
  sendSiteRecovered,
};
