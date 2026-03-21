const axios = require("axios");
const { getDB } = require("../model");
const notify = require("./notify");
const wa = require("./whatsapp");
const config = require("../config");

// Build axios config for one HTTP attempt
function buildCfg(monitor) {
  const targetUrl = monitor.url + (monitor.path || "");
  const cfg = {
    method: monitor.method.toLowerCase(),
    url: targetUrl,
    timeout: 12000,
    validateStatus: false,
    maxRedirects: 5,
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; GiftedMonitor/2.0)",
      Accept: "*/*",
    },
  };
  if (monitor.method === "POST") {
    const raw = (monitor.body || "").trim();
    if (raw) {
      try {
        cfg.data = JSON.parse(raw);
        cfg.headers["Content-Type"] = "application/json";
      } catch {
        cfg.data = raw;
        cfg.headers["Content-Type"] = "text/plain";
      }
    }
  }
  return cfg;
}

// Single HTTP attempt — returns { status, responseTime, errorMsg }
async function fetchOnce(monitor) {
  const targetUrl = monitor.url + (monitor.path || "");
  const start = Date.now();
  try {
    const resp = await axios(buildCfg(monitor));
    const responseTime = Date.now() - start;
    const status = resp.status >= 200 && resp.status < 400 ? "up" : "down";
    const errorMsg = status === "down" ? `HTTP ${resp.status}` : null;
    return { status, responseTime, errorMsg };
  } catch (err) {
    const responseTime = Date.now() - start;
    const errorMsg =
      err.code === "ECONNABORTED" || err.code === "ETIMEDOUT"
        ? "Timeout"
        : err.code || err.message;
    return { status: "down", responseTime, errorMsg };
  }
}

async function pingMonitor(monitor) {
  const db = getDB();
  const targetUrl = monitor.url + (monitor.path || "");

  // First attempt
  let result = await fetchOnce(monitor);

  // If first attempt reports down, wait 8s and retry once to avoid false alarms
  if (result.status === "down") {
    console.log(`⏳ [RETRY] ${targetUrl} — first attempt ${result.errorMsg}, retrying in 8s…`);
    await new Promise((r) => setTimeout(r, 8000));
    const retry = await fetchOnce(monitor);
    if (retry.status === "up") {
      console.log(`✅ [UP on retry] ${targetUrl} — ${retry.responseTime}ms`);
      result = retry;
    } else {
      console.error(`❌ [DOWN confirmed] ${targetUrl} — ${retry.errorMsg}`);
      result = retry; // use retry result for response time accuracy
    }
  } else {
    console.log(`✅ [UP] ${targetUrl} — ${result.responseTime}ms`);
  }

  const { status, responseTime, errorMsg } = result;
  const prevStatus = monitor.last_status;
  const now = new Date();
  const updates = {
    last_status: status,
    last_response_time: responseTime,
    last_checked: now,
  };

  // Notification preference helpers
  const canNotifyDown = monitor.notify_down !== false;
  const canNotifyUp   = monitor.notify_up   !== false;

  if (status === "down") {
    if (prevStatus !== "down") {
      updates.incident_start = now;
      updates.last_reminder_at = now;
      if (canNotifyDown) {
        const user = await db.getUserById(monitor.user_id);
        if (user && user.notify_down !== false)
          await notify.sendSiteDown(
            user,
            monitor,
            errorMsg || "Unknown error",
            wa.formatTime(now),
          );
      }
    } else if (monitor.incident_start && monitor.last_reminder_at) {
      const hoursSince =
        (Date.now() - new Date(monitor.last_reminder_at)) / (1000 * 60 * 60);
      if (hoursSince >= 24) {
        updates.last_reminder_at = now;
        if (canNotifyDown) {
          const user = await db.getUserById(monitor.user_id);
          if (user && user.notify_down !== false)
            await notify.sendSiteDown(
              user,
              monitor,
              `Still down — ${errorMsg || "error"}`,
              wa.formatTime(now),
            );
        }
      }
    }
  } else if (status === "up" && prevStatus === "down" && monitor.incident_start) {
    const downtimeMs = Date.now() - new Date(monitor.incident_start);
    updates.incident_start = null;
    updates.last_reminder_at = null;
    if (canNotifyUp) {
      const user = await db.getUserById(monitor.user_id);
      if (user && user.notify_up !== false)
        await notify.sendSiteRecovered(
          user,
          monitor,
          responseTime,
          wa.formatDuration(downtimeMs),
        );
    }
  }

  await db.updateMonitor(monitor.id, updates);
  await db.addCheckHistory(monitor.id, status, responseTime, errorMsg);
}

async function runPingCycle() {
  try {
    const db = getDB();
    const monitors = await db.getAllActiveMonitors();
    const now = Date.now();
    const due = monitors.filter((m) => {
      if (!m.last_checked) return true;
      return (
        (now - new Date(m.last_checked)) / 1000 / 60 >= (m.interval_mins || 3)
      );
    });
    if (due.length > 0) {
      console.log(`🔄 Pinging ${due.length}/${monitors.length} due monitors…`);
      await Promise.all(due.map(pingMonitor));
    }
  } catch (err) {
    console.error("Ping cycle error:", err.message);
  }
}

function startPingEngine() {
  runPingCycle();
  setInterval(runPingCycle, config.PING_CHECK_INTERVAL_SECS * 1000);
}

module.exports = {
  pingMonitor,
  runPingCycle,
  startPingEngine,
};
