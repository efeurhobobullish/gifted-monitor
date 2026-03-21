const { sendEmail, isEmailConfigured } = require("./sendEmail");
const emailTpl = require("../template/email");

/**
 * Sends OTP only by email (never WhatsApp/Telegram).
 * @returns {{ ok: boolean, reason?: string }}
 */
async function sendOtpEmail({ email, name }, code, purpose) {
  if (!isEmailConfigured()) {
    console.error(
      "❌ OTP email: set EMAIL and EMAIL_APP_PASSWORD in .env (Gmail app password).",
    );
    return { ok: false, reason: "not_configured" };
  }
  const p = String(purpose || "").toLowerCase();
  const subject = p.includes("reset")
    ? "Password reset code"
    : "Verify your email";
  const html = emailTpl.otpVerification(name, code);
  const sent = await sendEmail(email, subject, html);
  return { ok: !!sent, reason: sent ? undefined : "send_failed" };
}

module.exports = { sendOtpEmail };
