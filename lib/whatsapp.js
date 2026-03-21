const axios = require("axios");
const config = require("../config");

const BASE_URL = `https://graph.facebook.com/v25.0/${config.WHATSAPP_PHONE_ID}/messages`;
const HEADERS = () => ({
  Authorization: `Bearer ${config.WHATSAPP_TOKEN}`,
  "Content-Type": "application/json",
});

function configured(templateName) {
  if (!config.WHATSAPP_TOKEN || !config.WHATSAPP_PHONE_ID || !templateName) {
    console.warn(`⚠️  WhatsApp not configured — skipped: ${templateName}`);
    return false;
  }
  return true;
}

// Generic body-only template (monitor_created, site_down, site_recovered)
async function sendTemplate(to, templateName, params) {
  if (!configured(templateName)) return;
  try {
    await axios.post(
      BASE_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: params.map((p) => ({
                type: "text",
                text: String(p),
              })),
            },
          ],
        },
      },
      { headers: HEADERS() },
    );
    console.log(`📱 WhatsApp [${templateName}] → ${to}`);
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error(`⚠️  WhatsApp error [${templateName}]: ${msg}`);
  }
}

// OTP template: body({{code}}) + URL button({{code}})
async function sendOtp(to, _purpose, code) {
  const templateName = config.WA_TEMPLATE_OTP;
  if (!configured(templateName)) return;
  try {
    await axios.post(
      BASE_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: String(code) }],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: String(code) }],
            },
          ],
        },
      },
      { headers: HEADERS() },
    );
    console.log(`📱 WhatsApp OTP → ${to}`);
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error(`⚠️  WhatsApp OTP error: ${msg}`);
  }
}

const sendMonitorCreated = (to, userName, monitorName, url, intervalMins) =>
  sendTemplate(to, config.WA_TEMPLATE_MONITOR_CREATED, [
    userName,
    monitorName,
    url,
    String(intervalMins),
  ]);

const sendSiteDown = (to, userName, monitorName, url, error, timeDetected) =>
  sendTemplate(to, config.WA_TEMPLATE_SITE_DOWN, [
    userName,
    monitorName,
    url,
    error,
    timeDetected,
  ]);

const sendSiteRecovered = (
  to,
  userName,
  monitorName,
  url,
  responseTime,
  downtimeDuration,
) =>
  sendTemplate(to, config.WA_TEMPLATE_SITE_RECOVERED, [
    userName,
    monitorName,
    url,
    String(responseTime) + "ms",
    downtimeDuration,
  ]);

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function formatTime(date) {
  return new Date(date).toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
    hour12: false,
  });
}

module.exports = {
  sendOtp,
  sendMonitorCreated,
  sendSiteDown,
  sendSiteRecovered,
  formatDuration,
  formatTime,
};
