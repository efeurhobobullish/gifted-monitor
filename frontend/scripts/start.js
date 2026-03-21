/**
 * Start static server for Heroku or local.
 * Uses PORT from env (Heroku sets this) or default 3000.
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;
const dist = path.join(__dirname, "..", "dist");

const child = spawn("npx", ["serve", "-s", dist, "-l", String(port)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, PORT: String(port) },
});

child.on("exit", (code) => process.exit(code ?? 0));
