function sanitize(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[<>]/g, "").trim().slice(0, 500);
}

module.exports = { sanitize };
