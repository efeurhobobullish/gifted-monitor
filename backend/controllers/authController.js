const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { getDB } = require("../model");
const {
  generateOtp,
  otpExpiry,
  signToken,
  signResetToken,
  verifyResetToken,
  hashPassword,
  comparePassword,
  sanitize,
} = require("../libs/auth");
const { requireAuth } = require("../middleware/auth");
const { sendOtpEmail } = require("../utils/otpEmail");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts. Try again in 15 minutes." },
});
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many OTP requests. Try again in 15 minutes." },
});

// ── Shared validators ───────────
function validateEmail(email) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return "Enter a valid email address (e.g. you@example.com)";
  return null;
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 128) return "Password is too long";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter (A-Z)";
  if (!/[a-z]/.test(password))
    return "Password must include at least one lowercase letter (a-z)";
  if (!/[0-9]/.test(password))
    return "Password must include at least one number (0-9)";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must include at least one special character (!@#$%^&*...)";
  return null;
}

function validateFullName(name) {
  const s = String(name || "").trim();
  if (s.length < 2) return "Full name must be at least 2 characters";
  if (s.length > 100) return "Full name is too long (max 100 characters)";
  return null;
}

function validatePhone(whatsapp) {
  if (!whatsapp) return "Phone number is required";
  if (!/^\d{8,15}$/.test(whatsapp))
    return "Enter 8–15 digits with country code, no spaces or symbols (e.g. 254712345678)";
  return null;
}

function prefOff(v) {
  return v === false || v === 0 || v === "0";
}

function prefOn(v) {
  return v === true || v === 1 || v === "1";
}

// ── Signup ──────────────────
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const db = getDB();
    const username = sanitize(req.body.username);
    const name = sanitize(req.body.name);
    const email = sanitize(req.body.email)?.toLowerCase();
    const whatsapp = sanitize(req.body.whatsapp);
    const password = req.body.password;

    if (!username || !name || !email || !whatsapp || !password)
      return res.status(400).json({
        error:
          "Full name, username, email, phone number, and password are required",
      });

    const nameErr = validateFullName(name);
    if (nameErr) return res.status(400).json({ error: nameErr });

    if (!/^[a-z]{3,30}$/.test(username))
      return res
        .status(400)
        .json({
          error:
            "Username must be 3–30 lowercase letters only (no numbers, spaces, or symbols)",
        });

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ error: emailErr });

    const phoneErr = validatePhone(whatsapp);
    if (phoneErr) return res.status(400).json({ error: phoneErr });

    const pwErr = validatePassword(password);
    if (pwErr) return res.status(400).json({ error: pwErr });

    // Uniqueness checks — specific messages
    if (await db.getUserByEmail(email))
      return res
        .status(409)
        .json({ error: `That email is already registered` });

    if (await db.getUserByUsername(username.toLowerCase()))
      return res.status(409).json({ error: `That username is already taken` });

    if (await db.getUserByWhatsapp(whatsapp))
      return res
        .status(409)
        .json({
          error: `That whatsapp number is already linked to an account`,
        });

    const userCount = await db.getUserCount();
    const isFirstUser = userCount === 0;
    const passwordHash = await hashPassword(password);

    await db.createUser({
      username: username.toLowerCase(),
      name,
      email,
      whatsapp,
      passwordHash,
      isAdmin: isFirstUser,
      isSuperAdmin: isFirstUser,
    });

    const code = generateOtp();
    await db.createOtp(email, code, "signup", otpExpiry(10));
    const sent = await sendOtpEmail({ email, name }, code, "verify your account");
    if (!sent.ok) {
      return res.status(503).json({
        error:
          "Account was created but email could not be sent. Set EMAIL and EMAIL_APP_PASSWORD in server config, or contact support.",
        email,
      });
    }

    res.json({
      message:
        "Account created. Check your email for the verification code.",
      email,
      isAdmin: isFirstUser,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// ── Verify OTP ─────────────────────
router.post("/verify-otp", otpLimiter, async (req, res) => {
  try {
    const db = getDB();
    const email = sanitize(req.body.email)?.toLowerCase();
    const code = sanitize(req.body.code);
    const type = sanitize(req.body.type);

    if (!email || !code || !type)
      return res.status(400).json({ error: "Missing fields" });
    if (!/^\d{6}$/.test(code))
      return res.status(400).json({ error: "Invalid code format" });
    if (!["signup", "reset"].includes(type))
      return res.status(400).json({ error: "Invalid type" });

    const otp = await db.getValidOtp(email, code, type);
    if (!otp)
      return res
        .status(400)
        .json({ error: "Invalid or expired code. Request a new one." });
    await db.markOtpUsed(otp.id);

    if (type === "signup") {
      const user = await db.getUserByEmail(email);
      if (!user) return res.status(404).json({ error: "User not found" });
      await db.updateUser(user.id, { is_verified: true });
      const token = signToken(user.id, user.is_admin, user.is_superadmin);
      return res.json({
        message: "Account verified!",
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          whatsapp: user.whatsapp,
          is_admin: user.is_admin,
          is_superadmin: user.is_superadmin,
        },
      });
    }

    const resetToken = signResetToken(email);
    return res.json({ message: "OTP verified", resetToken });
  } catch (err) {
    console.error("OTP verify error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

// ── Resend OTP ────────────────
router.post("/resend-otp", otpLimiter, async (req, res) => {
  try {
    const db = getDB();
    const email = sanitize(req.body.email)?.toLowerCase();
    const type = sanitize(req.body.type);
    if (!email || !type || !["signup", "reset"].includes(type))
      return res.status(400).json({ error: "Invalid request" });

    const user = await db.getUserByEmail(email);
    if (!user)
      return res.status(404).json({ error: "No account found for that email" });

    const code = generateOtp();
    await db.createOtp(email, code, type, otpExpiry(10));
    const sent = await sendOtpEmail(
      { email: user.email, name: user.name },
      code,
      type === "reset" ? "reset your password" : "verify your account",
    );
    if (!sent.ok) {
      return res.status(503).json({
        error:
          "Email could not be sent. Check server email configuration (EMAIL_APP_PASSWORD).",
      });
    }
    res.json({ message: "New code sent to your email" });
  } catch {
    res.status(500).json({ error: "Failed to resend OTP" });
  }
});

// ── Login ────────────────────────
router.post("/login", authLimiter, async (req, res) => {
  try {
    const db = getDB();
    const identifier = sanitize(req.body.identifier)?.toLowerCase();
    const password = req.body.password;
    if (!identifier || !password || password.length > 128)
      return res
        .status(400)
        .json({ error: "Please enter your username or email and password" });

    // Look up by email or username
    const isEmail = identifier.includes("@");
    const user = isEmail
      ? await db.getUserByEmail(identifier)
      : await db.getUserByUsername(identifier);
    if (!user)
      return res
        .status(401)
        .json({ error: "Invalid username/email or password" });

    if (!(await comparePassword(password, user.password_hash)))
      return res
        .status(401)
        .json({ error: "Invalid username/email or password" });

    // Disabled account check
    if (user.is_disabled)
      return res
        .status(403)
        .json({
          error:
            "Unauthorised Login(User Suspended), Please contact Administrators",
        });

    // Unverified: auto-send a fresh OTP then tell the client to verify
    if (!user.is_verified) {
      const code = generateOtp();
      await db.createOtp(user.email, code, "signup", otpExpiry(10));
      const sent = await sendOtpEmail(
        { email: user.email, name: user.name },
        code,
        "verify your account",
      );
      if (!sent.ok) {
        return res.status(503).json({
          error:
            "Could not send verification email. Configure EMAIL and EMAIL_APP_PASSWORD on the server.",
          needsVerification: true,
          email: user.email,
        });
      }
      return res.status(403).json({
        error:
          "Account not verified. A new code has been sent to your email.",
        needsVerification: true,
        email: user.email,
      });
    }

    const token = signToken(user.id, user.is_admin, user.is_superadmin);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        is_admin: user.is_admin,
        is_superadmin: user.is_superadmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// ── Forgot password ────────────
router.post("/forgot-password", otpLimiter, async (req, res) => {
  try {
    const db = getDB();
    const email = sanitize(req.body.email)?.toLowerCase();
    if (!email) return res.status(400).json({ error: "Email is required" });

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ error: emailErr });

    const user = await db.getUserByEmail(email);
    if (!user)
      return res.status(404).json({ error: `No account found for ${email}` });

    const code = generateOtp();
    await db.createOtp(email, code, "reset", otpExpiry(10));
    const sent = await sendOtpEmail(
      { email: user.email, name: user.name },
      code,
      "reset your password",
    );
    if (!sent.ok) {
      return res.status(503).json({
        error:
          "Email could not be sent. Check server email configuration (EMAIL_APP_PASSWORD).",
      });
    }
    res.json({ message: "Reset code sent to your email", email });
  } catch {
    res.status(500).json({ error: "Failed to send reset code" });
  }
});

// ── Reset password ────────────────
router.post("/reset-password", async (req, res) => {
  try {
    const db = getDB();
    const { resetToken, password } = req.body;
    if (!resetToken || !password)
      return res.status(400).json({ error: "Missing fields" });

    const pwErr = validatePassword(password);
    if (pwErr) return res.status(400).json({ error: pwErr });

    let payload;
    try {
      payload = verifyResetToken(resetToken);
    } catch {
      return res
        .status(400)
        .json({ error: "Reset session expired. Please start over." });
    }

    const user = await db.getUserByEmail(payload.email);
    if (!user) return res.status(404).json({ error: "User not found" });

    await db.updateUser(user.id, {
      password_hash: await hashPassword(password),
    });
    res.json({ message: "Password reset successful. You can now log in." });
  } catch {
    res.status(500).json({ error: "Reset failed" });
  }
});

// ── Change password ────────────────────
router.post(
  "/change-password",
  requireAuth,
  async (req, res) => {
    try {
      const db = getDB();
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword)
        return res.status(400).json({ error: "All fields are required" });

      const user = await db.getUserById(req.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (!(await comparePassword(currentPassword, user.password_hash)))
        return res.status(400).json({ error: "Current password is incorrect" });

      if (currentPassword === newPassword)
        return res
          .status(400)
          .json({ error: "New password must differ from current password" });

      const pwErr = validatePassword(newPassword);
      if (pwErr) return res.status(400).json({ error: pwErr });

      await db.updateUser(user.id, {
        password_hash: await hashPassword(newPassword),
      });
      res.json({ message: "Password changed successfully" });
    } catch {
      res.status(500).json({ error: "Failed to change password" });
    }
  },
);

// ── Me ───────────────────────────────
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getDB().getUserById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.is_disabled)
      return res
        .status(401)
        .json({ error: "Unauthorised Login, Please contact Administrators" });
    // Always issue a fresh token so admin/superadmin promotions take effect immediately
    res.setHeader('x-refresh-token', signToken(user.id, !!user.is_admin, !!user.is_superadmin));
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      is_admin: user.is_admin,
      is_superadmin: user.is_superadmin,
      avatar: user.avatar || null,
      notify_down: user.notify_down !== false,
      notify_up:   user.notify_up   !== false,
      telegram_linked: !!user.telegram_chat_id,
      alert_whatsapp: !prefOff(user.alert_whatsapp),
      alert_telegram: prefOn(user.alert_telegram),
      alert_email: prefOn(user.alert_email),
    });
  } catch {
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// ── Link / unlink Telegram (same alerts as WhatsApp when chat_id is set) ──
router.post("/telegram-link", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const raw = req.body.chat_id;
    if (raw === null || raw === undefined || raw === "") {
      await db.updateUser(req.userId, { telegram_chat_id: null });
      return res.json({ message: "Telegram unlinked", telegram_linked: false });
    }
    const chatId = String(sanitize(String(raw))).trim();
    if (!/^-?\d{5,20}$/.test(chatId)) {
      return res.status(400).json({
        error:
          "Invalid chat id. Open @userinfobot on Telegram, tap Start, and paste your numeric id here.",
      });
    }
    const other = await db.getUserByTelegramChatId(chatId);
    if (other && String(other.id) !== String(req.userId)) {
      return res.status(409).json({
        error: "This Telegram account is already linked to another user.",
      });
    }
    await db.updateUser(req.userId, { telegram_chat_id: chatId });
    res.json({
      message:
        "Telegram linked. Enable “Telegram” under monitor alert channels (notification preferences) to receive uptime/downtime alerts.",
      telegram_linked: true,
    });
  } catch {
    res.status(500).json({ error: "Failed to update Telegram" });
  }
});

// ── Update Avatar ──────────────────────
router.put("/avatar", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { avatar } = req.body;

    if (avatar !== null && avatar !== undefined) {
      if (typeof avatar !== "string")
        return res.status(400).json({ error: "Invalid avatar data" });
      if (avatar.length > 2 * 1024 * 1024)
        return res.status(400).json({ error: "Avatar too large (max 2MB)" });
      if (avatar && !avatar.startsWith("data:image/"))
        return res.status(400).json({ error: "Avatar must be an image" });
    }

    await db.updateUser(req.userId, { avatar: avatar || null });
    res.json({
      message: "Avatar updated successfully",
      avatar: avatar || null,
    });
  } catch {
    res.status(500).json({ error: "Failed to update avatar" });
  }
});

// ── Update WhatsApp ─────────────────────
router.post(
  "/update-whatsapp",
  requireAuth,
  async (req, res) => {
    try {
      const db = getDB();
      const { whatsapp, password } = req.body;
      if (!whatsapp || !password)
        return res.status(400).json({ error: "All fields are required" });

      const phoneErr = ((ph) => {
        if (!/^\d{8,15}$/.test(ph))
          return "Enter 8–15 digits with country code, no spaces or symbols (e.g. 254712345678)";
        return null;
      })(whatsapp);
      if (phoneErr) return res.status(400).json({ error: phoneErr });

      const user = await db.getUserById(req.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (!(await comparePassword(password, user.password_hash)))
        return res.status(400).json({ error: "Incorrect password" });

      if (user.whatsapp === whatsapp)
        return res
          .status(400)
          .json({ error: "That is already your current WhatsApp number" });

      const existing = await db.getUserByWhatsapp(whatsapp);
      if (existing && String(existing.id) !== String(user.id))
        return res
          .status(409)
          .json({ error: `${whatsapp} is already linked to another account` });

      await db.updateUser(user.id, { whatsapp });
      res.json({ message: "WhatsApp number updated successfully" });
    } catch {
      res.status(500).json({ error: "Failed to update WhatsApp" });
    }
  },
);

// ── Update notification preferences ─────────────────────────────────
router.post(
  "/notification-prefs",
  requireAuth,
  async (req, res) => {
    try {
      const db = getDB();
      const {
        notify_down,
        notify_up,
        alert_whatsapp,
        alert_telegram,
        alert_email,
      } = req.body;
      const updates = {};
      if (notify_down !== undefined) updates.notify_down = notify_down !== false && notify_down !== 'false';
      if (notify_up !== undefined) updates.notify_up = notify_up !== false && notify_up !== 'false';
      if (alert_whatsapp !== undefined) updates.alert_whatsapp = alert_whatsapp !== false && alert_whatsapp !== 'false';
      if (alert_telegram !== undefined) updates.alert_telegram = alert_telegram === true || alert_telegram === 'true';
      if (alert_email !== undefined) updates.alert_email = alert_email === true || alert_email === 'true';
      if (!Object.keys(updates).length) return res.status(400).json({ error: 'No fields provided' });
      const user = await db.updateUser(req.userId, updates);
      const { password_hash, ...safe } = user;
      res.json(safe);
    } catch {
      res.status(500).json({ error: 'Failed to update notification preferences' });
    }
  }
);

module.exports = router;
