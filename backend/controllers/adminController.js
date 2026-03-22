const router = require("express").Router();
const { getDB } = require("../model");
const { sanitize, hashPassword, comparePassword } = require("../libs/auth");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { pingMonitor } = require("../libs/ping");
const { TIMEZONE } = require("../config");
const plans = require("../libs/plans");

router.use(requireAuth, requireAdmin);

// ─── Admin Stats ───────
router.get("/stats", async (req, res) => {
  try {
    const db = getDB();
    const [{ users }, { monitors, total: totalMonitors }] = await Promise.all([
      db.getAllUsers({ limit: 99999 }),
      db.getAllMonitors({ limit: 99999 }),
    ]);
    const up = monitors.filter((m) => m.last_status === "up").length;
    const down = monitors.filter((m) => m.last_status === "down").length;
    res.json({
      totalUsers: users.length,
      totalMonitors,
      monitorsUp: up,
      monitorsDown: down,
      timezone: TIMEZONE,
    });
  } catch {
    res.status(500).json({ error: "Failed to load stats" });
  }
});

// ─── Users ────────────────
router.get("/users", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const search = sanitize(req.query.search || "");
    const result = await getDB().getAllUsers({ search, page, limit });
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to load users" });
  }
});

// ─── Get monitors for a specific user (admin) ───
router.get("/users/:id/monitors", async (req, res) => {
  try {
    const db = getDB();
    const monitors = await db.getUserMonitors(req.params.id);
    const result = await Promise.all(
      monitors.map(async (m) => ({
        ...m,
        history: await db.getMonitorHistory(m.id, 30),
      })),
    );
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to load user monitors" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const db = getDB();
    const targetId = String(req.params.id);
    const selfId = String(req.userId);

    // Fetch target user to check permissions
    const target = await db.getUserById(targetId);
    if (!target) return res.status(404).json({ error: "User not found" });

    const actorIsSuperAdmin = !!req.isSuperAdmin;
    const actorIsAdmin = !!req.isAdmin;

    // Superadmin cannot be edited by anyone except themselves
    if (target.is_superadmin && targetId !== selfId)
      return res
        .status(403)
        .json({ error: "Cannot modify the superadmin account" });

    // Only superadmin can edit admins (other than themselves)
    if (target.is_admin && !target.is_superadmin && !actorIsSuperAdmin)
      return res
        .status(403)
        .json({ error: "Only the superadmin can modify admin accounts" });

    const {
      name,
      email,
      username,
      whatsapp,
      is_verified,
      is_admin,
      is_disabled,
      password,
      plan,
    } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = sanitize(name);
    if (email !== undefined) updates.email = sanitize(email).toLowerCase();
    if (whatsapp !== undefined) updates.whatsapp = sanitize(whatsapp);
    if (is_verified !== undefined) updates.is_verified = is_verified;

    // Username edit
    if (username !== undefined) {
      const uname = sanitize(username).toLowerCase();
      if (!/^[a-z]{3,30}$/.test(uname))
        return res
          .status(400)
          .json({ error: "Username must be 3–30 lowercase letters only" });
      const existing = await db.getUserByUsername(uname);
      if (existing && String(existing.id) !== targetId)
        return res.status(409).json({ error: `@${uname} is already taken` });
      updates.username = uname;
    }

    // Only superadmin can change admin status
    if (is_admin !== undefined) {
      if (!actorIsSuperAdmin)
        return res
          .status(403)
          .json({ error: "Only the superadmin can change admin status" });
      // Superadmin can't demote themselves
      if (targetId === selfId)
        return res
          .status(400)
          .json({ error: "You cannot change your own admin status" });
      updates.is_admin = is_admin;
    }

    // Disable/enable: only superadmin can affect admins; only superadmin/admin for regular users
    if (is_disabled !== undefined) {
      if (targetId === selfId)
        return res
          .status(400)
          .json({ error: "You cannot disable your own account" });
      if (target.is_superadmin)
        return res
          .status(403)
          .json({ error: "Cannot disable the superadmin account" });
      if (target.is_admin && !actorIsSuperAdmin)
        return res
          .status(403)
          .json({ error: "Only the superadmin can disable admin accounts" });
      updates.is_disabled = is_disabled;
    }

    if (password) {
      if (password.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      updates.password_hash = await hashPassword(password);
    }

    if (plan !== undefined) {
      const key = String(plan).toLowerCase().trim();
      if (!plans.isValidPlanKey(key))
        return res.status(400).json({ error: "plan must be starter, elite, or pro" });
      if (!actorIsSuperAdmin && !actorIsAdmin)
        return res.status(403).json({ error: "Only admins can change plan" });
      updates.plan = key;
    }

    const user = await db.updateUser(targetId, updates);
    const { password_hash, ...safe } = user;
    res.json(safe);
  } catch {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const db = getDB();
    const targetId = String(req.params.id);
    const selfId = String(req.userId);

    if (targetId === selfId)
      return res.status(400).json({ error: "Cannot delete your own account" });

    const target = await db.getUserById(targetId);
    if (!target) return res.status(404).json({ error: "User not found" });

    if (target.is_superadmin)
      return res.status(403).json({ error: "Cannot delete the superadmin account" });

    if (target.is_admin && !req.isSuperAdmin)
      return res.status(403).json({ error: "Only the superadmin can delete admin accounts" });

    // Require admin's own password to confirm deletion
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ error: "Password is required to delete a user" });
    const self = await db.getUserById(selfId);
    if (!self || !(await comparePassword(password, self.password_hash)))
      return res.status(400).json({ error: "Incorrect password. Deletion cancelled." });

    await db.deleteUser(targetId);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ─── Monitors ──────────────────
router.get("/monitors", async (req, res) => {
  try {
    const db = getDB();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const search = sanitize(req.query.search || "");
    const { monitors, total } = await db.getAllMonitors({
      search,
      page,
      limit,
    });
    const result = await Promise.all(
      monitors.map(async (m) => ({
        ...m,
        history: await db.getMonitorHistory(m.id, 30),
      })),
    );
    res.json({ monitors: result, total, page, limit });
  } catch {
    res.status(500).json({ error: "Failed to load monitors" });
  }
});

router.get("/monitors/:id", async (req, res) => {
  try {
    const db = getDB();
    const monitor = await db.getMonitor(req.params.id);
    if (!monitor) return res.status(404).json({ error: "Monitor not found" });
    const history = await db.getMonitorHistory(monitor.id, 60);
    res.json({ ...monitor, history });
  } catch {
    res.status(500).json({ error: "Failed to load monitor" });
  }
});

router.put("/monitors/:id", async (req, res) => {
  try {
    const db = getDB();
    const { name, url, path, method, body, intervalMins, is_active, notify_down, notify_up } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = sanitize(name);
    if (url !== undefined) updates.url = sanitize(url);
    if (path !== undefined) updates.path = path ? sanitize(path) : null;
    if (method !== undefined) updates.method = sanitize(method).toUpperCase();
    if (body !== undefined) updates.body = sanitize(body);
    if (intervalMins !== undefined) updates.interval_mins = parseInt(intervalMins);
    if (is_active !== undefined) updates.is_active = is_active;
    if (notify_down !== undefined) updates.notify_down = notify_down !== false && notify_down !== 'false';
    if (notify_up !== undefined) updates.notify_up = notify_up !== false && notify_up !== 'false';
    res.json(await db.updateMonitor(req.params.id, updates));
  } catch {
    res.status(500).json({ error: "Failed to update monitor" });
  }
});

router.delete("/monitors/:id", async (req, res) => {
  try {
    const db = getDB();
    // Require admin's own password to confirm deletion
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ error: "Password is required to delete a monitor" });
    const self = await db.getUserById(req.userId);
    if (!self || !(await comparePassword(password, self.password_hash)))
      return res.status(400).json({ error: "Incorrect password. Deletion cancelled." });
    await db.deleteMonitor(req.params.id);
    res.json({ message: "Monitor deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete monitor" });
  }
});

router.post("/monitors/:id/ping", async (req, res) => {
  try {
    const monitor = await getDB().getMonitor(req.params.id);
    if (!monitor) return res.status(404).json({ error: "Monitor not found" });
    pingMonitor(monitor);
    res.json({ message: "Ping triggered" });
  } catch {
    res.status(500).json({ error: "Failed to ping" });
  }
});

router.get("/contact", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const result = await getDB().getContactMessages({ page, limit: 10 });
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.patch("/contact/:id/read", async (req, res) => {
  try {
    await getDB().markContactRead(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to update message" });
  }
});

router.delete("/contact/:id", async (req, res) => {
  try {
    await getDB().deleteContactMessage(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;
