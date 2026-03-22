/**
 * Subscription plans: monitor caps and allowed check intervals (minutes only — no arbitrary "custom").
 * Users without `plan` in DB are treated as legacy "elite".
 */
const LEGACY_DEFAULT_PLAN = "elite";

/** All tiers use preset intervals only (enforced in API + UI). */
const PLAN_DEFS = {
  starter: {
    maxMonitors: 5,
    allowedIntervals: [5, 10, 30, 60],
  },
  elite: {
    maxMonitors: 20,
    allowedIntervals: [3, 5, 10, 30, 60],
  },
  pro: {
    maxMonitors: 100,
    allowedIntervals: [1, 3, 5, 10, 30, 60],
  },
};

const VALID = new Set(["starter", "elite", "pro"]);

function normalizePlan(user) {
  const raw =
    user && user.plan != null ? String(user.plan).toLowerCase().trim() : "";
  if (VALID.has(raw)) return raw;
  return LEGACY_DEFAULT_PLAN;
}

function isValidPlanKey(plan) {
  return VALID.has(String(plan || "").toLowerCase().trim());
}

function getPlanLimits(user) {
  return PLAN_DEFS[normalizePlan(user)];
}

function getAllowedIntervals(user) {
  return getPlanLimits(user).allowedIntervals;
}

/**
 * @param {object} user
 * @param {number|string} intervalMins
 */
function isIntervalAllowed(user, intervalMins) {
  const i = parseInt(intervalMins, 10);
  if (!Number.isFinite(i) || i < 1 || i > 1440) return false;
  return getAllowedIntervals(user).includes(i);
}

/** Default interval when creating a monitor (first preset that is "sensible"). */
function defaultIntervalMins(user) {
  const a = getAllowedIntervals(user);
  if (a.includes(5)) return 5;
  return a[0] ?? 5;
}

module.exports = {
  PLAN_DEFS,
  LEGACY_DEFAULT_PLAN,
  normalizePlan,
  isValidPlanKey,
  getPlanLimits,
  getAllowedIntervals,
  isIntervalAllowed,
  defaultIntervalMins,
};
