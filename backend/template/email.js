const config = require("../config");

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function baseLayout({ title, bodyHtml }) {
  const appUrl = escapeHtml(config.EMAIL_APP_URL);
  const logo = escapeHtml(config.EMAIL_LOGO_URL);
  const fromName = escapeHtml(config.EMAIL_FROM_NAME);
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7f8fa;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .container {
      width: min(600px, 90%);
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(to right, #6951f2, #ff69b4);
      text-align: center;
      padding: 30px;
    }
    .header img { max-height: 120px; width: auto; }
    .content {
      padding: 40px 30px;
      color: #1e293b;
    }
    .content h2 {
      margin-top: 0;
      color: #444;
      font-size: 20px;
    }
    .content p {
      line-height: 1.6;
      font-size: 16px;
      color: #475569;
    }
    .cta { text-align: center; margin: 30px 0; }
    .cta a {
      background-color: #6951f2;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 10px;
      font-weight: bold;
      display: inline-block;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      background-color: #f1f5f9;
      padding: 20px;
      font-size: 13px;
      color: #64748b;
    }
    .username { font-weight: bold; color: #1e293b; }
    .code {
      font-size: 28px;
      letter-spacing: 8px;
      color: #6951f2;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
    }
    strong { color: #6951f2; font-size: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logo}" alt="${fromName}" />
    </div>
    <div class="content">
      ${bodyHtml}
    </div>
    <div class="footer">
      &copy; ${year} ${fromName}. All rights reserved.<br />
      <a href="${appUrl}" style="color:#6951f2; font-weight: bold; text-decoration: none;">${appUrl}</a>
    </div>
  </div>
</body>
</html>`;
}

/** Login notice — mirrors “session / login” awareness (like WhatsApp login flows). */
function login(name) {
  const n = escapeHtml(name);
  const dash = `${escapeHtml(config.EMAIL_APP_URL)}/dashboard`;
  return baseLayout({
    title: "Sign-in notification",
    bodyHtml: `
      <p>Hi <span class="username">${n}</span> 👋,</p>
      <p>A successful sign-in was detected on your <strong>Gifted Monitor</strong> account. Your monitors and alerts are available.</p>
      <div class="cta">
        <a href="${dash}">Open dashboard</a>
      </div>
      <p>If this wasn’t you, change your password and contact support immediately.</p>
    `,
  });
}

/** Registration / welcome — aligns with signup verification journey. */
function register(name) {
  const n = escapeHtml(name);
  const dash = `${escapeHtml(config.EMAIL_APP_URL)}/dashboard`;
  return baseLayout({
    title: "Welcome to Gifted Monitor",
    bodyHtml: `
      <h2>Welcome aboard</h2>
      <p>Hi <span class="username">${n}</span> 👋,</p>
      <p>Your account is ready. Add monitors, set intervals, and get alerts when sites go down or recover.</p>
      <div class="cta">
        <a href="${dash}">Go to dashboard</a>
      </div>
      <p>Choose WhatsApp, Telegram, and/or email in your notification settings for uptime and downtime alerts.</p>
    `,
  });
}

/** OTP / verification code — same role as <code>template/whatsapp</code> OTP. */
function otpVerification(name, code) {
  const n = escapeHtml(name);
  const c = escapeHtml(code);
  return baseLayout({
    title: "Verification code",
    bodyHtml: `
      <h2>Your verification code</h2>
      <p>Hi <span class="username">${n}</span>,</p>
      <p>Use this code to verify your account:</p>
      <p class="code">${c}</p>
      <p>It expires soon. If you didn’t request this, you can ignore this email.</p>
    `,
  });
}

/** New monitor created — same idea as WhatsApp “monitor created” template. */
function monitorCreated(name, monitorName, url, intervalMins) {
  const n = escapeHtml(name);
  const mn = escapeHtml(monitorName);
  const u = escapeHtml(url);
  const interval = escapeHtml(String(intervalMins));
  const dash = `${escapeHtml(config.EMAIL_APP_URL)}/dashboard`;
  return baseLayout({
    title: "Monitor created",
    bodyHtml: `
      <h2>Monitor saved</h2>
      <p>Hi <span class="username">${n}</span>,</p>
      <p>Your monitor <strong>${mn}</strong> is now active.</p>
      <p><strong>URL:</strong> ${u}<br/><strong>Interval:</strong> every ${interval} minutes</p>
      <div class="cta">
        <a href="${dash}">View monitors</a>
      </div>
    `,
  });
}

/** Site / endpoint reported down — same idea as WhatsApp “site down”. */
function siteDown(name, monitorName, url, error, timeDetected) {
  const n = escapeHtml(name);
  const mn = escapeHtml(monitorName);
  const u = escapeHtml(url);
  const err = escapeHtml(error || "Unknown error");
  const t = escapeHtml(timeDetected);
  const dash = `${escapeHtml(config.EMAIL_APP_URL)}/dashboard`;
  return baseLayout({
    title: "Monitor is down",
    bodyHtml: `
      <h2>Down alert</h2>
      <p>Hi <span class="username">${n}</span>,</p>
      <p>We detected a problem with <strong>${mn}</strong>.</p>
      <p><strong>URL:</strong> ${u}<br/>
      <strong>Error:</strong> ${err}<br/>
      <strong>Time:</strong> ${t}</p>
      <div class="cta">
        <a href="${dash}">Open dashboard</a>
      </div>
    `,
  });
}

/** Service recovered — same idea as WhatsApp “back online”. */
function siteRecovered(
  name,
  monitorName,
  url,
  responseTimeMs,
  downtimeDuration,
) {
  const n = escapeHtml(name);
  const mn = escapeHtml(monitorName);
  const u = escapeHtml(url);
  const rt = escapeHtml(String(responseTimeMs));
  const down = escapeHtml(downtimeDuration);
  const dash = `${escapeHtml(config.EMAIL_APP_URL)}/dashboard`;
  return baseLayout({
    title: "Monitor is back online",
    bodyHtml: `
      <h2>Recovered</h2>
      <p>Hi <span class="username">${n}</span>,</p>
      <p><strong>${mn}</strong> is responding again.</p>
      <p><strong>URL:</strong> ${u}<br/>
      <strong>Response time:</strong> ${rt} ms<br/>
      <strong>Downtime:</strong> ${down}</p>
      <div class="cta">
        <a href="${dash}">View dashboard</a>
      </div>
    `,
  });
}

module.exports = {
  login,
  register,
  otpVerification,
  monitorCreated,
  siteDown,
  siteRecovered,
};
