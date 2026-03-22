const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

module.exports = {
  // ── Server ──────────────────────
  PORT: process.env.PORT || 58420,
  NODE_ENV: process.env.NODE_ENV || "development",

  // ── Database ────────────────────
  DATABASE_URL: process.env.DATABASE_URL || "",

  // ── Auth ────────────────────────
  JWT_SECRET: process.env.JWT_SECRET || "gifted_monitor_jwt_secret_2024",

  // ── WhatsApp -───────────────────
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || "",
  WHATSAPP_PHONE_ID: process.env.WHATSAPP_PHONE_ID || "",

  // ── Telegram Bot (optional) ─────
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",

  // ── WhatsApp Template Names ─────
  WA_TEMPLATE_OTP: process.env.WA_TEMPLATE_OTP || "gifted_monitor_otp",
  WA_TEMPLATE_MONITOR_CREATED:
    process.env.WA_TEMPLATE_MONITOR_CREATED || "gifted_monitor_created",
  WA_TEMPLATE_SITE_DOWN:
    process.env.WA_TEMPLATE_SITE_DOWN || "gifted_monitor_down",
  WA_TEMPLATE_SITE_RECOVERED:
    process.env.WA_TEMPLATE_SITE_RECOVERED || "gifted_monitor_back_online",

  // ── Monitoring Engine ────────────
  PING_CHECK_INTERVAL_SECS: parseInt(
    process.env.PING_CHECK_INTERVAL_SECS || "10",
  ),
  /** Absolute floor (minutes); per-plan minimums may be higher — see libs/plans.js */
  MIN_PING_INTERVAL_MINS: parseInt(process.env.MIN_PING_INTERVAL_MINS || "1"),

  // ── Timezone -────────────────────
  TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi",

  // ── Email (Nodemailer / Gmail) ──
  /** Gmail address used to send mail */
  EMAIL: process.env.EMAIL || "",
  /** Gmail App Password (not your normal login). Fallback: PASSWORD */
  EMAIL_APP_PASSWORD:
    process.env.EMAIL_APP_PASSWORD || process.env.PASSWORD || "",
  EMAIL_APP_URL:
    process.env.EMAIL_APP_URL ||
    process.env.APP_PUBLIC_URL ||
    "https://monitor.giftedtech.co.ke",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Gifted Monitor",
  EMAIL_LOGO_URL:
    process.env.EMAIL_LOGO_URL ||
    "https://i.ibb.co/pjkSwKQK/full-logo-white.png",

  // ── CORS ─────────────────────────
  ALLOWED_ORIGINS: (
    process.env.ALLOWED_ORIGINS || "https://monitor.giftedtech.co.ke"
  )
    .split(",")
    .map((o) => o.trim()),
};
