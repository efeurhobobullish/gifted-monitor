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
