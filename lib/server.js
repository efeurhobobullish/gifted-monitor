const express = require("express");
const helmet = require("helmet");
const path = require("path");
const config = require("../config");

const app = express();
app.set("trust proxy", 1);

// ─── Security Headers ──────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://cdn.tailwindcss.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// ─── CORS ────────────────────────
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = config.ALLOWED_ORIGINS;

  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (!origin) {
    // Same-origin or server-to-server — allow through
  } else if (config.NODE_ENV !== "production") {
    // In development, allow all origins
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
});

// ─── Body Parser ─────────────────
app.use(express.json({ limit: "10mb" }));

// ─── Static Files ────────────────
app.use(express.static(path.join(__dirname, "..", "public")));

// ─── API Routes ──────────────────
app.use("/api", require("../routes"));

// ─── SPA Fallback ────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
