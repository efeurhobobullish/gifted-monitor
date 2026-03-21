const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const { sanitize } = require("../utils/sanitize");

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpExpiry(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function signToken(userId, isAdmin = false, isSuperAdmin = false) {
  return jwt.sign(
    {
      userId: String(userId),
      isAdmin: !!isAdmin,
      isSuperAdmin: !!isSuperAdmin,
    },
    config.JWT_SECRET,
    { expiresIn: "3d" },
  );
}

function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

function signResetToken(email) {
  return jwt.sign(
    { email, purpose: "reset" },
    config.JWT_SECRET,
    { expiresIn: "10m" },
  );
}

function verifyResetToken(token) {
  const payload = jwt.verify(token, config.JWT_SECRET);
  if (payload.purpose !== "reset") throw new Error("Invalid reset token");
  return payload;
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  generateOtp,
  otpExpiry,
  signToken,
  verifyToken,
  signResetToken,
  verifyResetToken,
  hashPassword,
  comparePassword,
  sanitize,
};
