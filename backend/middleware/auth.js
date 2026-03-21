const { verifyToken, signToken } = require("../libs/auth");

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = verifyToken(auth.slice(7));
    req.userId = payload.userId;
    req.isAdmin = payload.isAdmin;
    req.isSuperAdmin = payload.isSuperAdmin;

    const msLeft = payload.exp * 1000 - Date.now();
    if (msLeft < 12 * 60 * 60 * 1000) {
      res.setHeader(
        "x-refresh-token",
        signToken(payload.userId, payload.isAdmin, payload.isSuperAdmin),
      );
    }

    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

function requireAdmin(req, res, next) {
  if (!req.isAdmin)
    return res.status(403).json({ error: "Admin access required" });
  next();
}

module.exports = { requireAuth, requireAdmin };
