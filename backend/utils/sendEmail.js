const nodemailer = require("nodemailer");
const config = require("../config");

let transporter;

function getTransporter() {
  const user = config.EMAIL;
  const pass = config.EMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

function isEmailConfigured() {
  return !!(config.EMAIL && config.EMAIL_APP_PASSWORD);
}

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendEmail(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.warn(
      "⚠️  Email skipped: set EMAIL and EMAIL_APP_PASSWORD in .env (Gmail app password).",
    );
    return false;
  }
  const fromName = config.EMAIL_FROM_NAME;
  const from = `"${fromName}" <${config.EMAIL}>`;
  await t.sendMail({
    from,
    to,
    subject,
    html,
  });
  return true;
}

module.exports = {
  sendEmail,
  isEmailConfigured,
};
