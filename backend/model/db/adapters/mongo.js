async function createMongoAdapter(DATABASE_URL) {
  const mongoose = require('mongoose');
  await mongoose.connect(DATABASE_URL);

  const UserSchema = new mongoose.Schema({
    username:    { type: String, unique: true, required: true },
    name:        { type: String, required: true },
    email:       { type: String, unique: true, required: true },
    whatsapp:    { type: String, required: true },
    password_hash: { type: String, required: true },
    is_verified:   { type: Boolean, default: false },
    is_admin:      { type: Boolean, default: false },
    is_superadmin: { type: Boolean, default: false },
    is_disabled:   { type: Boolean, default: false },
    avatar:        { type: String, default: null },
    telegram_chat_id: { type: String, default: null },
    alert_whatsapp:    { type: Boolean, default: true },
    alert_telegram:    { type: Boolean, default: false },
    alert_email:       { type: Boolean, default: false },
    created_at:    { type: Date, default: Date.now }
  });

  const OtpSchema = new mongoose.Schema({
    email:      String,
    code:       String,
    type:       String,
    expires_at: Date,
    used:       { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
  });

  const MonitorSchema = new mongoose.Schema({
    user_id:            { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name:               String,
    url:                String,
    path:               { type: String, default: null },
    method:             { type: String, default: 'GET' },
    body:               String,
    interval_mins:      { type: Number, default: 3 },
    is_active:          { type: Boolean, default: true },
    last_status:        { type: String, default: 'unknown' },
    last_response_time: Number,
    last_checked:       Date,
    uptime_pct:         { type: Number, default: 100 },
    incident_start:     Date,
    last_reminder_at:   Date,
    created_at:         { type: Date, default: Date.now }
  });

  const HistorySchema = new mongoose.Schema({
    monitor_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Monitor' },
    status:        String,
    response_time: Number,
    error_msg:     String,
    checked_at:    { type: Date, default: Date.now }
  });

  const User    = mongoose.models.User    || mongoose.model('User',    UserSchema);
  const Otp     = mongoose.models.Otp     || mongoose.model('Otp',     OtpSchema);
  const Monitor = mongoose.models.Monitor || mongoose.model('Monitor', MonitorSchema);
  const History = mongoose.models.History || mongoose.model('History', HistorySchema);

  function toPlain(doc) {
    if (!doc) return null;
    const o = doc.toObject ? doc.toObject() : doc;
    o.id = o._id ? o._id.toString() : o.id;
    return o;
  }

  return {
    async getUserCount() { return User.countDocuments(); },

    async createUser({ username, name, email, whatsapp, passwordHash, isAdmin = false, isSuperAdmin = false }) {
      return toPlain(await User.create({
        username, name, email, whatsapp,
        password_hash: passwordHash,
        is_admin: isAdmin, is_superadmin: isSuperAdmin
      }));
    },

    async getUserByEmail(email)       { return toPlain(await User.findOne({ email })); },
    async getUserByUsername(username) { return toPlain(await User.findOne({ username })); },
    async getUserByWhatsapp(whatsapp) { return toPlain(await User.findOne({ whatsapp })); },
    async getUserByTelegramChatId(chatId) {
      if (!chatId) return null;
      return toPlain(await User.findOne({ telegram_chat_id: String(chatId) }));
    },
    async getUserById(id)             { return toPlain(await User.findById(id)); },

    async updateUser(id, fields) {
      return toPlain(await User.findByIdAndUpdate(id, fields, { new: true }));
    },

    async getAllUsers({ search = '', page = 1, limit = 10 } = {}) {
      const q = search
        ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { username: new RegExp(search, 'i') }] }
        : {};
      const total = await User.countDocuments(q);
      const users = await User.find(q, 'username name email whatsapp is_verified is_admin is_superadmin is_disabled avatar created_at')
        .sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit);
      return { users: users.map(toPlain), total };
    },

    async deleteUser(id) { await User.findByIdAndDelete(id); },

    async createOtp(email, code, type, expiresAt) {
      await Otp.updateMany({ email, type, used: false }, { used: true });
      return toPlain(await Otp.create({ email, code, type, expires_at: expiresAt }));
    },

    async getValidOtp(email, code, type) {
      return toPlain(await Otp.findOne({ email, code, type, used: false, expires_at: { $gt: new Date() } }));
    },

    async markOtpUsed(id) { await Otp.findByIdAndUpdate(id, { used: true }); },

    async createMonitor(userId, { name, url, path, method, body, intervalMins }) {
      return toPlain(await Monitor.create({
        user_id: userId, name, url,
        path: path || null, method: method || 'GET',
        body: body || null, interval_mins: intervalMins || 3
      }));
    },

    async getUserMonitors(userId) {
      return (await Monitor.find({ user_id: userId }).sort({ created_at: -1 })).map(toPlain);
    },

    async getAllMonitors({ search = '', page = 1, limit = 20 } = {}) {
      const skip = (page - 1) * limit;
      let monitorQ = {};
      if (search) {
        const userMatches = await User.find({
          $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }]
        }, '_id');
        const userIds = userMatches.map(u => u._id);
        monitorQ = { $or: [
          { name: new RegExp(search, 'i') },
          { url:  new RegExp(search, 'i') },
          { user_id: { $in: userIds } }
        ]};
      }
      const total = await Monitor.countDocuments(monitorQ);
      const ms = await Monitor.find(monitorQ)
        .populate('user_id', 'name email username')
        .sort({ created_at: -1 }).skip(skip).limit(limit);
      const monitors = ms.map(m => {
        const o = toPlain(m);
        if (m.user_id) {
          o.user_name     = m.user_id.name;
          o.user_email    = m.user_id.email;
          o.user_username = m.user_id.username;
          o.user_id       = m.user_id._id.toString();
        }
        return o;
      });
      return { monitors, total };
    },

    async getMonitor(id) { return toPlain(await Monitor.findById(id)); },

    async updateMonitor(id, fields) {
      return toPlain(await Monitor.findByIdAndUpdate(id, fields, { new: true }));
    },

    async deleteMonitor(id) { await Monitor.findByIdAndDelete(id); },

    async getAllActiveMonitors() {
      const ms = await Monitor.find({ is_active: true }).populate('user_id', 'name whatsapp');
      return ms.map(m => {
        const o = toPlain(m);
        if (m.user_id) {
          o.user_name     = m.user_id.name;
          o.user_whatsapp = m.user_id.whatsapp;
          o.user_id       = m.user_id._id.toString();
        }
        return o;
      });
    },

    async addCheckHistory(monitorId, status, responseTime, errorMsg) {
      await History.create({
        monitor_id: monitorId, status,
        response_time: responseTime || null,
        error_msg: errorMsg || null
      });
      const count = await History.countDocuments({ monitor_id: monitorId });
      if (count > 60) {
        const old = await History.find({ monitor_id: monitorId }).sort({ checked_at: 1 }).limit(10);
        await History.deleteMany({ _id: { $in: old.map(h => h._id) } });
      }
      const all = await History.find({ monitor_id: monitorId });
      const uptime = all.length > 0
        ? Math.round((all.filter(h => h.status === 'up').length / all.length) * 1000) / 10
        : 100;
      await Monitor.findByIdAndUpdate(monitorId, { uptime_pct: uptime });
    },

    async getMonitorHistory(monitorId, limit = 30) {
      return (await History.find({ monitor_id: monitorId })
        .sort({ checked_at: -1 }).limit(limit)).reverse().map(toPlain);
    }
  };
}

module.exports = { createMongoAdapter };
