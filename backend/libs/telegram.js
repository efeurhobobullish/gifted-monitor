const axios = require("axios");
const config = require("../config");
function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function configured() {
  return !!config.TELEGRAM_BOT_TOKEN;
}

async function sendHtml(chatId, html) {
  if (!configured() || chatId == null || chatId === "") return;
  const id = String(chatId).trim();
  if (!id) return;
  try {
    await axios.post(
      `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: id,
        text: html,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      },
    );
    console.log(`📨 Telegram → ${id}`);
  } catch (err) {
    const msg =
      err.response?.data?.description ||
      err.response?.data?.message ||
      err.message;
    console.error(`⚠️  Telegram error: ${msg}`);
  }
}

async function sendOtp(chatId, code, purpose) {
  if (!configured() || !chatId) return;
  const p = escapeHtml(purpose || "verification");
  const c = escapeHtml(code);
  const html = `<b>Gifted Monitor</b>\n\nYour OTP for <i>${p}</i>:\n\n<code>${c}</code>`;
  await sendHtml(chatId, html);
}

async function sendMonitorCreated(
  chatId,
  userName,
  monitorName,
  url,
  intervalMins,
) {
  if (!configured() || !chatId) return;
  const html = `<b>Monitor created</b>\n\nHi ${escapeHtml(userName)},\n\n<b>${escapeHtml(monitorName)}</b>\n${escapeHtml(url)}\n\nInterval: every ${escapeHtml(String(intervalMins))} min`;
  await sendHtml(chatId, html);
}

async function sendSiteDown(
  chatId,
  userName,
  monitorName,
  url,
  error,
  timeDetected,
) {
  if (!configured() || !chatId) return;
  const html = `<b>Site down</b>\n\nHi ${escapeHtml(userName)},\n\n<b>${escapeHtml(monitorName)}</b>\n${escapeHtml(url)}\n\nError: ${escapeHtml(error)}\nTime: ${escapeHtml(timeDetected)}`;
  await sendHtml(chatId, html);
}

async function sendSiteRecovered(
  chatId,
  userName,
  monitorName,
  url,
  responseTime,
  downtimeDuration,
) {
  if (!configured() || !chatId) return;
  const html = `<b>Back online</b>\n\nHi ${escapeHtml(userName)},\n\n<b>${escapeHtml(monitorName)}</b>\n${escapeHtml(url)}\n\nResponse: ${escapeHtml(String(responseTime))}ms\nDowntime: ${escapeHtml(downtimeDuration)}`;
  await sendHtml(chatId, html);
}

module.exports = {
  sendOtp,
  sendMonitorCreated,
  sendSiteDown,
  sendSiteRecovered,
};
