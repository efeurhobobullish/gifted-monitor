const config = require("../config");

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowed = config.ALLOWED_ORIGINS;

  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (!origin) {
    // same-origin or server-to-server
  } else if (config.NODE_ENV !== "production") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
}

module.exports = { corsMiddleware };
