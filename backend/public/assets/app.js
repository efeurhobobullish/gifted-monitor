/* ── Page Loader ── */
function showPageLoader() {
  const el = document.getElementById('page-loader');
  if (el) { el.style.opacity = '1'; el.style.display = 'flex'; el.style.transition = 'none'; }
}
function hidePageLoader() {
  const el = document.getElementById('page-loader');
  if (!el) return;
  // Stagger-animate all fade-up elements in main content
  const mc = document.getElementById('main-content');
  if (mc) {
    const items = Array.from(mc.querySelectorAll('.animate-fade-up'));
    // Pause all animations at once
    items.forEach(item => { item.style.animation = 'none'; });
    // Single reflow to apply the paused state
    void mc.offsetHeight;
    // Re-enable with staggered delays
    items.forEach((item, i) => {
      item.style.animation = '';
      item.style.animationDelay = `${Math.min(i * 65, 520)}ms`;
    });
  }
  el.style.transition = 'opacity .35s ease';
  el.style.opacity = '0';
  setTimeout(() => { el.style.display = 'none'; }, 360);
}
// Scroll to top on every page load/reload
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  const m = document.querySelector('main');
  if (m) m.scrollTop = 0;
});

// Intercept internal link clicks → show loader for seamless nav
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto') || a.target === '_blank') return;
  showPageLoader();
});
// Back-button / bfcache restore — hide loader + unlock scroll
window.addEventListener('pageshow', e => {
  if (e.persisted) {
    hidePageLoader();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    const main = document.querySelector('main');
    if (main) main.style.overflow = '';
    closeSidebar();
  }
});
// Inject Font Awesome once
(function() {
  if (!document.getElementById('fa-cdn')) {
    const l = document.createElement('link');
    l.id = 'fa-cdn'; l.rel = 'stylesheet';
    l.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    document.head.appendChild(l);
  }
})();

/* ── Token / User ── */
function getToken()  { return localStorage.getItem('gm_token'); }
function setToken(t) { localStorage.setItem('gm_token', t); }
function clearToken(){ localStorage.removeItem('gm_token'); localStorage.removeItem('gm_user'); }
function getUser()   { try { return JSON.parse(localStorage.getItem('gm_user') || 'null'); } catch { return null; } }
function setUser(u)  { localStorage.setItem('gm_user', JSON.stringify(u)); }

/** Plan-based allowed check intervals (minutes); presets only — no custom. Admin UI shows all presets. */
function getAllowedCheckIntervals() {
  try {
    if (typeof location !== 'undefined' && location.pathname && location.pathname.includes('/admin/')) {
      return [1, 3, 5, 10, 30, 60];
    }
    const u = typeof _user !== 'undefined' && _user ? _user : getUser();
    if (u && u.plan_limits && Array.isArray(u.plan_limits.allowed_intervals_mins)) {
      return u.plan_limits.allowed_intervals_mins;
    }
  } catch (_) {}
  return [1, 3, 5, 10, 30, 60];
}
function applyIntervalUiForPlan() {
  const allowed = getAllowedCheckIntervals();
  document.querySelectorAll('.interval-opt').forEach(btn => {
    const v = btn.dataset.val;
    if (v === 'custom') { btn.style.display = 'none'; return; }
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) return;
    btn.style.display = allowed.includes(n) ? '' : 'none';
  });
  document.getElementById('custom-interval-wrap')?.classList.add('hidden');
}
function defaultIntervalForPlan() {
  const allowed = getAllowedCheckIntervals();
  if (allowed.includes(5)) return 5;
  return allowed[0] || 5;
}
function snapIntervalToAllowed(mins) {
  const allowed = getAllowedCheckIntervals();
  const m = parseInt(mins, 10);
  if (Number.isFinite(m) && allowed.includes(m)) return m;
  return allowed[0] || 5;
}

// Client-side JWT decode (no signature verification — for expiry check only)
function _decodeJwt(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64));
  } catch { return null; }
}
function isTokenLocallyValid() {
  const token = getToken();
  if (!token) return false;
  const p = _decodeJwt(token);
  return p && p.exp && Date.now() < p.exp * 1000;
}

/* ── API ── */
async function api(method, url, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  const token = getToken();
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  if (body !== undefined) opts.body = JSON.stringify(body);
  const controller = new AbortController();
  opts.signal = controller.signal;
  const timer = setTimeout(() => controller.abort(), 20000);
  let res, data;
  try {
    res = await fetch(url, opts);
    clearTimeout(timer);
  } catch (netErr) {
    clearTimeout(timer);
    const msg = netErr.name === 'AbortError' ? 'Request timed out. Check your connection.' : 'Network error. Check your connection.';
    toast.error(msg);
    throw netErr;
  }
  try {
    data = await res.json();
  } catch {
    const err = new Error('Server returned an invalid response');
    toast.error(err.message);
    throw err;
  }
  // Sliding-window token refresh
  const newToken = res.headers.get('x-refresh-token');
  if (newToken) setToken(newToken);

  if (res.status === 401 && !url.includes('/auth/login')) {
    clearToken();
    location.href = '/auth/login/';
    throw new Error('Session expired');
  }
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.data = data;
    throw err;
  }
  return data;
}

/* ── Auth guards ── */
async function requireAuth() {
  if (!isTokenLocallyValid()) {
    clearToken();
    location.href = '/auth/login/';
    return null;
  }
  try {
    const user = await api('GET', '/api/auth/me');
    setUser(user);
    return user;
  } catch {
    clearToken();
    location.href = '/auth/login/';
    return null;
  }
}
async function requireAdmin() {
  const user = await requireAuth();
  if (!user) return null;
  if (!user.is_admin) { location.href = '/'; return null; }
  return user;
}
// requireGuest: fast local check — no server round-trip needed for redirect
function requireGuest() {
  if (isTokenLocallyValid()) {
    location.replace('/');
    return false;
  }
  clearToken(); // clean up any expired token
  return true;
}
function doLogout() { clearToken(); showPageLoader(); location.href = '/auth/login/'; }

/* ── Header user dropdown ── */
function renderHeaderUser(user) {
  const slot = document.getElementById('hdr-user-slot');
  if (!slot) return;

  // Remove any existing fixed dropdown portal
  const old = document.getElementById('user-dropdown-portal');
  if (old) old.remove();

  // Build the floating dropdown as a body-level portal so backdrop-blur
  // stacking contexts in the header can never clip it.
  const portal = document.createElement('div');
  portal.id = 'user-dropdown-portal';
  portal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:0;z-index:99999;pointer-events:none;';

  if (!user) {
    portal.innerHTML = `
      <div id="user-dropdown"
        style="display:none;position:fixed;pointer-events:auto;"
        class="w-44 bg-[#0d1117] border border-[#1e2740] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <a href="/auth/login/" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
          🔑 <span>Sign In</span>
        </a>
        <a href="/auth/signup/" class="flex items-center gap-3 px-4 py-3 text-sm text-green-400 hover:bg-green-500/5 transition-colors border-t border-[#1e2740]">
          ✨ <span>Sign Up</span>
        </a>
      </div>`;

    slot.innerHTML = `
      <div id="user-menu-wrap">
        <button id="user-menu-btn" onclick="toggleUserDropdown(event)"
          class="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md shadow-green-500/20 hover:scale-105 hover:shadow-green-500/30 transition-all flex-shrink-0" title="Account">
          👤
        </button>
      </div>`;
  } else {
    const init = (user.name || user.username || '?').charAt(0).toUpperCase();
    const avatarBtn = user.avatar
      ? `<img src="${user.avatar}" class="w-full h-full object-cover rounded-full" alt="${escHtml(init)}" onerror="this.parentNode.innerHTML='${escHtml(init)}'"/>`
      : escHtml(init);
    portal.innerHTML = `
      <div id="user-dropdown"
        style="display:none;position:fixed;pointer-events:auto;"
        class="w-56 bg-[#0d1117] border border-[#1e2740] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div class="px-4 py-3 border-b border-[#1e2740] flex items-center gap-3">
          <div class="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 overflow-hidden">
            ${user.avatar ? `<img src="${user.avatar}" class="w-full h-full object-cover" alt="${escHtml(init)}" onerror="this.parentNode.innerHTML='${escHtml(init)}'"/>` : escHtml(init)}
          </div>
          <div class="min-w-0">
            <div class="font-semibold text-sm text-gray-100 truncate">${escHtml(user.name || user.username)}</div>
            <div class="text-xs text-gray-500 truncate mt-0.5">${escHtml(user.email || '')}</div>
          </div>
        </div>
        <a href="/profile/" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
          👤 <span>Profile</span>
        </a>
        <button onclick="doLogout()" class="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/5 transition-colors w-full text-left border-t border-[#1e2740]">
          🚪 <span>Logout</span>
        </button>
      </div>`;

    slot.innerHTML = `
      <div id="user-menu-wrap">
        <button id="user-menu-btn" onclick="toggleUserDropdown(event)"
          class="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md shadow-green-500/20 hover:scale-105 hover:shadow-green-500/30 transition-all flex-shrink-0 overflow-hidden" title="${escHtml(user.name || user.username)}">
          ${avatarBtn}
        </button>
      </div>`;
  }

  document.body.appendChild(portal);
}

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const dd  = document.getElementById('user-dropdown');
  const btn = document.getElementById('user-menu-btn');
  if (!dd) return;

  const isOpen = dd.style.display !== 'none' && dd.style.display !== '';
  if (isOpen) { dd.style.display = 'none'; return; }

  // Position the fixed dropdown below the button
  if (btn) {
    const r = btn.getBoundingClientRect();
    const ddWidth = dd.classList.contains('w-56') ? 224 : 176;
    let left = r.right - ddWidth;
    if (left < 8) left = 8;
    dd.style.top  = (r.bottom + 8) + 'px';
    dd.style.left = left + 'px';
    dd.style.right = 'auto';
  }

  dd.style.display = 'block';
  dd.style.animation = 'none';
  dd.offsetHeight;
  dd.style.animation = 'dropdownIn .15s ease-out both';

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function handler(ev) {
      if (!dd.contains(ev.target) && ev.target.id !== 'user-menu-btn' && !ev.target.closest('#user-menu-btn')) {
        dd.style.display = 'none';
        document.removeEventListener('click', handler);
      }
    });
  }, 0);
}

/* ── Toast ── */
const toast = (() => {
  let root = null;
  const icons  = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const titles = { success: 'Success', error: 'Error', info: 'Info', warning: 'Warning' };

  function init() {
    if (root && document.body.contains(root)) return;
    root = document.createElement('div');
    root.id = 'toast-root';
    document.body.appendChild(root);
  }

  function show(msg, type = 'success', duration = 4000) {
    init();
    const el = document.createElement('div');
    el.className = `gm-toast ${type}`;
    el.innerHTML = `
      <span class="gm-toast-icon">${icons[type] || '💬'}</span>
      <div class="gm-toast-body">
        <div class="gm-toast-title">${titles[type] || type}</div>
        <div class="gm-toast-msg">${escHtml(msg)}</div>
      </div>
      <button class="gm-toast-close" onclick="this.closest('.gm-toast').remove()">✕</button>
      <div class="gm-toast-progress" style="animation-duration:${duration}ms"></div>
    `;
    root.appendChild(el);
    setTimeout(() => {
      if (!el.parentNode) return;
      el.classList.add('dying');
      setTimeout(() => el.remove(), 280);
    }, duration);
  }

  return {
    success: (m, d) => show(m, 'success', d),
    error:   (m, d) => show(m, 'error',   d),
    info:    (m, d) => show(m, 'info',    d),
    warning: (m, d) => show(m, 'warning', d),
    show,
  };
})();

/* ── Button loading ── */
function setBtnLoading(id, loading) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>';
  } else {
    btn.innerHTML = btn.dataset.orig || btn.innerHTML;
  }
}

/* ── Helpers ── */
function escHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}
function timeAgo(d) {
  if (!d) return '—';
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 5)    return 'just now';
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}
function fmtMs(ms) { return !ms ? '—' : ms < 1000 ? `${ms}ms` : `${(ms/1000).toFixed(2)}s`; }
function calcUptime(hist) {
  if (!hist || !hist.length) return '—';
  return ((hist.filter(h => h.status === 'up').length / hist.length) * 100).toFixed(1) + '%';
}
function statusColor(s) {
  return s === 'up' ? 'text-green-400' : s === 'down' ? 'text-red-400' : 'text-gray-400';
}
function statusBg(s) {
  return s === 'up'
    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
    : s === 'down'
    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
    : 'bg-gray-700/30 text-gray-400 border border-gray-600/20';
}
function borderColor(s) {
  return s === 'up' ? '#22c55e' : s === 'down' ? '#ef4444' : '#4b5563';
}

/* ── Validation ── */
function validateEmail(email) {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Enter a valid email address (e.g. you@example.com)';
  return null;
}
function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8)             return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password))         return 'Password must include at least one uppercase letter (A-Z)';
  if (!/[a-z]/.test(password))         return 'Password must include at least one lowercase letter (a-z)';
  if (!/[0-9]/.test(password))         return 'Password must include at least one number (0-9)';
  if (!/[^A-Za-z0-9]/.test(password))  return 'Password must include at least one special character (!@#$%^&*...)';
  return null;
}
function validatePhone(phone) {
  if (!phone) return 'Phone number is required';
  const d = phone.replace(/\D/g, '');
  if (d.length < 8 || d.length > 15) return 'Enter 8–15 digits with country code (e.g. 254712345678)';
  if (!/^\d+$/.test(phone))           return 'Digits only — no spaces or symbols';
  return null;
}

// Live password strength checker
function renderPasswordStrength(password, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  if (!password) { el.innerHTML = ''; return; }

  const checks = [
    { ok: password.length >= 8,           label: 'At least 8 characters' },
    { ok: /[A-Z]/.test(password),         label: 'Uppercase letter (A-Z)' },
    { ok: /[a-z]/.test(password),         label: 'Lowercase letter (a-z)' },
    { ok: /[0-9]/.test(password),         label: 'Number (0-9)' },
    { ok: /[^A-Za-z0-9]/.test(password),  label: 'Special character (!@#$...)' },
  ];
  const passed = checks.filter(c => c.ok).length;
  const strength = passed <= 1 ? 'Weak' : passed <= 3 ? 'Fair' : passed === 4 ? 'Good' : 'Strong';
  const barColors = { Weak: 'bg-red-500', Fair: 'bg-yellow-500', Good: 'bg-blue-400', Strong: 'bg-green-500' };
  const barWidths = { Weak: 'w-1/5', Fair: 'w-2/5', Good: 'w-3/5', Strong: 'w-full' };
  const textColors = { Weak: 'text-red-400', Fair: 'text-yellow-400', Good: 'text-blue-400', Strong: 'text-green-400' };

  el.innerHTML = `
    <div class="mt-2">
      <div class="flex items-center gap-2 mb-1.5">
        <div class="flex-1 h-1.5 bg-[#1e2740] rounded-full overflow-hidden">
          <div class="${barColors[strength]} ${barWidths[strength]} h-full rounded-full transition-all duration-300"></div>
        </div>
        <span class="text-xs font-semibold ${textColors[strength]}">${strength}</span>
      </div>
      <div class="grid grid-cols-1 gap-0.5">
        ${checks.map(c => `
          <div class="flex items-center gap-1.5 text-xs ${c.ok ? 'text-green-400' : 'text-gray-600'}">
            <span>${c.ok ? '✓' : '○'}</span><span>${c.label}</span>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ── OTP ── */
function otpMove(input, idx) {
  const digits = [...document.querySelectorAll('.otp-digit')];
  const val = input.value.replace(/\D/g,'');
  if (val.length > 1) {
    [...val].forEach((c,i) => { if (digits[idx+i]) digits[idx+i].value = c; });
    digits[Math.min(idx+val.length, digits.length-1)]?.focus();
    return;
  }
  input.value = val;
  if (val && idx < digits.length-1) digits[idx+1].focus();
}
function otpBack(e, idx) {
  const digits = [...document.querySelectorAll('.otp-digit')];
  if (e.key === 'Backspace' && !digits[idx].value && idx > 0) digits[idx-1].focus();
}
function getOtpCode() { return [...document.querySelectorAll('.otp-digit')].map(d => d.value).join(''); }
function clearOtp()   { document.querySelectorAll('.otp-digit').forEach(d => d.value = ''); }

/* ── Resend countdown ── */
const _cdTimers = {};
function startResendCd(btnId, cdId, secs=60) {
  const btn = document.getElementById(btnId);
  const cd  = document.getElementById(cdId);
  if (!btn) return;
  btn.disabled = true;
  let r = secs;
  if (cd) cd.textContent = `Resend in ${r}s`;
  if (_cdTimers[btnId]) clearInterval(_cdTimers[btnId]);
  _cdTimers[btnId] = setInterval(() => {
    r--;
    if (r <= 0) { clearInterval(_cdTimers[btnId]); btn.disabled = false; if (cd) cd.textContent = ''; }
    else if (cd) cd.textContent = `Resend in ${r}s`;
  }, 1000);
}

/* ── Sidebar ── */
function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebar-overlay');
  if (!s) return;
  const open = !s.classList.contains('translate-x-0');
  s.classList.toggle('-translate-x-full', !open);
  s.classList.toggle('translate-x-0', open);
  if (o) { o.classList.toggle('opacity-0', !open); o.classList.toggle('pointer-events-none', !open); }
  document.body.style.overflow = open ? 'hidden' : '';
  document.documentElement.style.overflow = open ? 'hidden' : '';
  const main = document.querySelector('main');
  if (main) main.style.overflow = open ? 'hidden' : '';
}
function closeSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebar-overlay');
  if (s) { s.classList.add('-translate-x-full'); s.classList.remove('translate-x-0'); }
  if (o) { o.classList.add('opacity-0','pointer-events-none'); }
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  const main = document.querySelector('main');
  if (main) main.style.overflow = '';
}

/* ── App layout ── */
function renderLayout(user, active='') {
  const isAdmin = user && user.is_admin;

  const navItems = [
    { href:'/', key:'dashboard', icon:'fa-gauge-high',    label:'Dashboard' },
    { href:'/monitors/',  key:'monitors',  icon:'fa-satellite-dish', label:'Monitors'  },
    { href:'/profile/',   key:'profile',   icon:'fa-circle-user',   label:'Profile'   },
    ...(isAdmin ? [{ href:'/admin/', key:'admin', icon:'fa-shield-halved', label:'Admin' }] : []),
  ];
  const adminItems = isAdmin ? [
    { href:'/admin/',           key:'admin',           icon:'fa-chart-pie',      label:'Overview'     },
    { href:'/admin/users/',     key:'admin-users',     icon:'fa-users',           label:'Users'        },
    { href:'/admin/monitors/',  key:'admin-monitors',  icon:'fa-satellite-dish',  label:'All Monitors' },
    { href:'/admin/messages/',  key:'admin-messages',  icon:'fa-envelope',        label:'Messages'     },
  ] : [];

  // Desktop nav (labels only — no icons in top bar)
  const dn = document.getElementById('hdr-nav');
  if (dn) dn.innerHTML = navItems.map(n =>
    `<a href="${n.href}" class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${active===n.key ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}">${n.label}</a>`
  ).join('');

  // Header user dropdown
  renderHeaderUser(user);

  // Sidebar nav
  const sn = document.getElementById('sidebar-nav');
  if (sn) {
    const iconEl = (cls) => `<i class="fa-solid ${cls} w-4 text-center flex-shrink-0 text-[13px]"></i>`;
    let html = '<div class="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">Navigation</div>';
    html += navItems.map(n =>
      `<a href="${n.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${active===n.key ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}">
        ${iconEl(n.icon)}${n.label}
       </a>`
    ).join('');
    if (isAdmin && adminItems.length) {
      html += '<div class="mx-3 my-2 border-t border-[#1e2740]"></div>';
      html += '<div class="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">Admin</div>';
      html += adminItems.map(n =>
        `<a href="${n.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${active===n.key ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}">
          ${iconEl(n.icon)}${n.label}
         </a>`
      ).join('');
    }
    sn.innerHTML = html;
  }

  // Sidebar user info
  const sa = document.getElementById('sidebar-avatar');
  const sn2 = document.getElementById('sidebar-name');
  const se = document.getElementById('sidebar-email');
  const sb = document.getElementById('sidebar-badge');
  const init = ((user?.name || '?').charAt(0)).toUpperCase();
  if (sa) {
    if (user?.avatar) {
      sa.innerHTML = `<img src="${user.avatar}" class="w-full h-full object-cover rounded-full" alt="${escHtml(init)}" onerror="this.parentNode.innerHTML='${escHtml(init)}'"/>`;
      sa.style.padding = '0';
    } else {
      sa.textContent = init;
    }
  }
  if (sn2) sn2.textContent = user?.name || '';
  if (se) se.textContent = user?.email || '';
  if (sb) sb.style.display = isAdmin ? 'inline-flex' : 'none';

  // Scroll-to-top button — inject once per page
  if (!document.getElementById('scroll-top-btn')) {
    const btn = document.createElement('button');
    btn.id = 'scroll-top-btn';
    btn.title = 'Back to top';
    btn.innerHTML = '<i class="fa-solid fa-chevron-up text-sm"></i>';
    btn.className = 'scroll-top-btn hidden';
    btn.onclick = () => {
      const m = document.querySelector('main');
      if (m) m.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(btn);
    // Listen on both main and window
    const onScroll = () => {
      const m = document.querySelector('main');
      const scrollEl = (m && m.scrollHeight > m.clientHeight) ? m : document.documentElement;
      const scrolled = scrollEl.scrollTop || window.scrollY || 0;
      const threshold = (scrollEl.scrollHeight - scrollEl.clientHeight) * 0.6;
      btn.classList.toggle('hidden', scrolled < threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(() => {
      const m = document.querySelector('main');
      if (m) m.addEventListener('scroll', onScroll, { passive: true });
    }, 500);
  }
}

/* ── Monitor card ── */
function siteCardHTML(m, opts={}) {
  const s = m.last_status || 'unknown';
  const hist = m.history || [];
  const ticks = hist.slice(-30).map(h =>
    `<div class="htick-${h.status} flex-shrink-0 rounded-sm cursor-pointer"
      data-tick-status="${escHtml(h.status)}"
      data-tick-time="${escHtml(h.checked_at||'')}"
      data-tick-response="${escHtml(fmtMs(h.response_time))}"
      data-tick-error="${escHtml(h.error_msg||'')}"
      style="width:7px;height:24px"></div>`
  ).join('');
  const owner = opts.showOwner && m.user_name
    ? `<div class="text-xs text-gray-500 mt-0.5">👤 ${escHtml(m.user_name)}</div>` : '';
  const clickAttr = opts.detailUrl
    ? `role="button" tabindex="0" onclick="location.href='${opts.detailUrl}?id=${m.id}'"
       onkeydown="if(event.key==='Enter')location.href='${opts.detailUrl}?id=${m.id}'"` : '';

  return `<div ${clickAttr}
    class="gm-monitor-card group bg-[#111620] rounded-2xl border border-[#1e2740] p-4 hover:bg-[#161c2a] cursor-pointer animate-fade-up"
    style="border-left: 3px solid ${borderColor(s)}">
    <div class="flex items-start gap-3 mb-3">
      <div class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 dot-${s}"></div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-gray-100 truncate">${escHtml(m.name)}</div>
        <div class="text-xs text-gray-500 truncate mt-0.5">${escHtml(m.url + (m.path || ''))}</div>
        ${owner}
      </div>
      <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${statusBg(s)}">${s.toUpperCase()}</span>
        <span class="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">${m.method||'GET'}</span>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-0 border border-[#1e2740] rounded-xl overflow-hidden mb-3 text-center">
      ${[
        ['Response', fmtMs(m.last_response_time), ''],
        ['Uptime',   calcUptime(hist), s==='up'?'text-green-400':s==='down'?'text-red-400':''],
        ['Interval', (m.interval_mins||3)+'m', ''],
        ['Checked',  timeAgo(m.last_checked), ''],
      ].map(([label,val,cls],i) =>
        `<div class="${i<3?'border-r border-[#1e2740]':''} px-2 py-2">
          <div class="text-[9px] text-gray-600 uppercase tracking-wide mb-1">${label}</div>
          <div class="text-xs font-semibold ${cls||'text-gray-300'}">${val}</div>
        </div>`
      ).join('')}
    </div>
    <div class="flex items-center gap-2 overflow-hidden">
      <div class="flex gap-0.5 overflow-x-auto flex-1" style="scrollbar-width:none">${ticks||'<span class="text-xs text-gray-600">No checks yet</span>'}</div>
      <span class="text-[10px] text-gray-600 flex-shrink-0">30 checks</span>
    </div>
    ${opts.actions || ''}
  </div>`;
}

/* ── Monitor modal ── */
let _editId = null, _selInterval = 5;
function openAddModal() {
  _editId = null;
  applyIntervalUiForPlan();
  _selInterval = defaultIntervalForPlan();
  const mt = document.getElementById('modal-title');
  if (mt) mt.textContent = 'Add Monitor';
  const mb = document.getElementById('modal-save-btn');
  if (mb) mb.dataset.orig = mb.innerHTML = '<span>Add Monitor</span>';
  const nm = document.getElementById('m-name');    if (nm) nm.value = '';
  const ul = document.getElementById('m-url');     if (ul) ul.value = '';
  const pt = document.getElementById('m-path');    if (pt) pt.value = '';
  const me = document.getElementById('m-method');  if (me) me.value = 'GET';
  const bd = document.getElementById('m-body');    if (bd) bd.value = '';
  const prev = document.getElementById('m-url-preview');
  if (prev) prev.textContent = 'https://example.com';
  document.getElementById('m-active-wrap')?.classList.add('hidden');
  document.querySelectorAll('.interval-opt').forEach(o => o.classList.remove('selected'));
  document.querySelector(`.interval-opt[data-val="${_selInterval}"]`)?.classList.add('selected');
  document.getElementById('custom-interval-wrap')?.classList.add('hidden');
  document.getElementById('m-body-group')?.classList.add('hidden');
  setNotifyToggle('down', true);
  setNotifyToggle('up', true);
  openModal('monitor-modal');
}
function openEditModal(m) {
  applyIntervalUiForPlan();
  _editId = m.id;
  _selInterval = snapIntervalToAllowed(m.interval_mins || 5);

  const nm = document.getElementById('m-name');   if (nm) nm.value = m.name   || '';
  const ul = document.getElementById('m-url');    if (ul) ul.value = m.url    || '';
  const pt = document.getElementById('m-path');   if (pt) pt.value = m.path   || '';
  const me = document.getElementById('m-method'); if (me) me.value = m.method || 'GET';
  const bd = document.getElementById('m-body');   if (bd) bd.value = m.body   || '';

  // Reflect method-dependent body field
  document.getElementById('m-body-group')?.classList.toggle('hidden', (m.method || 'GET') !== 'POST');

  // Update combined URL preview to show actual monitor URL
  const prev = document.getElementById('m-url-preview');
  if (prev) prev.textContent = (m.url || '') + (m.path || '') || 'https://example.com';

  // Active / paused toggle — shown only in edit mode
  const activeWrap = document.getElementById('m-active-wrap');
  if (activeWrap) {
    activeWrap.classList.remove('hidden');
    const active = m.is_active !== false;
    const activeChk = document.getElementById('m-active');
    if (activeChk) activeChk.checked = active;
    const activeDot = document.getElementById('m-active-dot');
    if (activeDot) activeDot.style.background = active ? '#4ade80' : '#6b7280';
    const activeLabel = document.getElementById('m-active-label');
    if (activeLabel) activeLabel.textContent = active ? 'Active' : 'Paused';
  }

  // Interval buttons (presets only)
  document.querySelectorAll('.interval-opt').forEach(o => o.classList.remove('selected'));
  document.querySelector(`.interval-opt[data-val="${_selInterval}"]`)?.classList.add('selected');
  document.getElementById('custom-interval-wrap')?.classList.add('hidden');

  setNotifyToggle('down', m.notify_down !== false);
  setNotifyToggle('up',   m.notify_up   !== false);

  const mt = document.getElementById('modal-title');
  if (mt) mt.textContent = 'Edit Monitor';
  const mb = document.getElementById('modal-save-btn');
  if (mb) mb.dataset.orig = mb.innerHTML = '<span>Save Changes</span>';
  openModal('monitor-modal');
}
function setNotifyToggle(which, val) {
  const on = val !== false && val !== 'false' && val !== false;
  const btn  = document.getElementById(`m-notify-${which}-btn`);
  const knob = document.getElementById(`m-notify-${which}-knob`);
  const hid  = document.getElementById(`m-notify-${which}`);
  if (!btn) return;
  btn.style.background   = on ? '#22c55e' : '#374151';
  if (knob) knob.style.transform = on ? 'translateX(1.125rem)' : 'translateX(0)';
  if (hid) hid.value = on ? 'true' : 'false';
}
function toggleNotifyBtn(which) {
  const hid = document.getElementById(`m-notify-${which}`);
  if (!hid) return;
  setNotifyToggle(which, hid.value !== 'true');
}
function selectInterval(val) {
  const n = parseInt(val, 10);
  if (!Number.isFinite(n)) return;
  _selInterval = n;
  document.querySelectorAll('.interval-opt').forEach(o => o.classList.remove('selected'));
  document.querySelector(`.interval-opt[data-val="${n}"]`)?.classList.add('selected');
  document.getElementById('custom-interval-wrap')?.classList.add('hidden');
}
function methodChanged() {
  const method = document.getElementById('m-method')?.value;
  document.getElementById('m-body-group')?.classList.toggle('hidden', method !== 'POST');
}

/* ── Modal helpers ── */
function _lockScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  const main = document.querySelector('main');
  if (main) { main._prevOverflow = main.style.overflow; main.style.overflow = 'hidden'; }
}
function _unlockScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  const main = document.querySelector('main');
  if (main) { main.style.overflow = main._prevOverflow || ''; delete main._prevOverflow; }
}
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  _lockScroll();
  m.classList.remove('hidden'); m.classList.add('flex');
  requestAnimationFrame(() => {
    const inner = m.querySelector('.modal-inner');
    if (inner) inner.style.animation = 'scaleIn .3s cubic-bezier(.34,1.56,.64,1) both';
  });
}
function closeModal(id) {
  const m = document.getElementById(id || 'monitor-modal');
  if (!m) return;
  const inner = m.querySelector('.modal-inner');
  const _afterHide = () => {
    m.classList.add('hidden'); m.classList.remove('flex');
    // Restore scroll only after modal is actually hidden — avoids race condition
    const anyOpen = document.querySelector('[id$="-modal"]:not(.hidden)');
    if (!anyOpen) _unlockScroll();
  };
  if (inner) {
    inner.style.animation = 'scaleOut .2s ease forwards';
    setTimeout(_afterHide, 200);
  } else {
    _afterHide();
  }
}

/* ── Page animate ── */
function animatePage(selector='.animate-on-load', base='animate-fade-up') {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add(base, `delay-${Math.min(i*50, 400)}`);
  });
}

/* ── URL preview + active toggle helpers (shared across pages) ── */
function updateUrlPreview() {
  const url  = (document.getElementById('m-url')?.value || '').trim();
  const path = (document.getElementById('m-path')?.value || '').trim();
  const el   = document.getElementById('m-url-preview');
  if (el) el.textContent = (url + path) || 'https://example.com';
}
document.addEventListener('input', e => {
  if (e.target.id === 'm-url' || e.target.id === 'm-path') updateUrlPreview();
});
function toggleActiveBtn() {
  const chk   = document.getElementById('m-active');
  const dot   = document.getElementById('m-active-dot');
  const label = document.getElementById('m-active-label');
  if (!chk) return;
  chk.checked = !chk.checked;
  const active = chk.checked;
  if (dot)   dot.style.background = active ? '#4ade80' : '#6b7280';
  if (label) label.textContent = active ? 'Active' : 'Paused';
}

/* ── Tick time formatter ── */
function formatTickTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  const diff = Date.now() - d;
  if (diff < 86400000) return timeAgo(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
         ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/* ── Breadcrumbs ── */
function renderBreadcrumbs(crumbs) {
  document.getElementById('gm-breadcrumbs')?.remove();
  if (!crumbs || crumbs.length < 2) return;
  const bar = document.createElement('div');
  bar.id = 'gm-breadcrumbs';
  bar.className = 'gm-breadcrumb-bar';
  bar.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const item = isLast
      ? `<span class="gm-bc-active">${escHtml(c.label)}</span>`
      : `<a href="${c.href}" class="gm-bc-link">${escHtml(c.label)}</a>`;
    return i > 0 ? `<span class="gm-bc-sep">›</span>${item}` : item;
  }).join('');
  const header = document.querySelector('header');
  if (header) header.insertAdjacentElement('afterend', bar);
}

/* ── History tick tooltip ── */
(function() {
  let _tip = null;
  let _hideTimer = null;
  function getTip() {
    if (!_tip) {
      _tip = document.createElement('div');
      _tip.id = 'gm-tick-tip';
      _tip.className = 'gm-tick-tooltip';
      document.body.appendChild(_tip);
    }
    return _tip;
  }
  function positionTip(t, clientX, clientY) {
    t.style.visibility = 'hidden'; t.style.display = 'block';
    const tw = t.offsetWidth || 170;
    const th = t.offsetHeight || 60;
    let left = clientX - tw / 2;
    let top  = clientY - th - 14;
    if (left < 6) left = 6;
    if (left + tw > window.innerWidth - 6) left = window.innerWidth - tw - 6;
    if (top < 6) top = clientY + 18;
    t.style.left = left + 'px'; t.style.top = top + 'px';
    t.style.visibility = ''; t.style.opacity = '1';
  }
  function hideTip() { if (_tip) { _tip.style.opacity = '0'; setTimeout(() => { if (_tip) _tip.style.display = 'none'; }, 180); } }
  function buildContent(el) {
    const s = el.dataset.tickStatus || 'unknown';
    const t = el.dataset.tickTime;
    const r = el.dataset.tickResponse;
    const err = el.dataset.tickError;
    const col = s === 'up' ? '#4ade80' : s === 'down' ? '#f87171' : '#9ca3af';
    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
      <span style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0;display:inline-block"></span>
      <span style="font-weight:700;color:${col};text-transform:uppercase;font-size:11px">${escHtml(s)}</span>
    </div>
    <div style="font-size:11px;color:#9ca3af">${escHtml(formatTickTime(t))}</div>
    ${r && r !== '—' ? `<div style="font-size:11px;color:#d1d5db;margin-top:2px">⏱ ${escHtml(r)}</div>` : ''}
    ${err ? `<div style="font-size:10px;color:#f87171;margin-top:3px;word-break:break-word">${escHtml(err)}</div>` : ''}`;
  }
  document.addEventListener('mouseover', e => {
    const tick = e.target.closest('[data-tick-status]');
    if (!tick) return;
    clearTimeout(_hideTimer);
    const t = getTip();
    t.innerHTML = buildContent(tick);
    positionTip(t, e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', e => {
    const tick = e.target.closest('[data-tick-status]');
    if (!tick || !_tip || _tip.style.display === 'none') return;
    positionTip(_tip, e.clientX, e.clientY);
  });
  document.addEventListener('mouseout', e => {
    const tick = e.target.closest('[data-tick-status]');
    if (!tick) return;
    _hideTimer = setTimeout(hideTip, 80);
  });
  document.addEventListener('click', e => {
    const tick = e.target.closest('[data-tick-status]');
    if (!tick) return;
    clearTimeout(_hideTimer);
    const t = getTip();
    t.innerHTML = buildContent(tick);
    const r = tick.getBoundingClientRect();
    positionTip(t, r.left + r.width / 2, r.top + window.scrollY - window.scrollY);
    positionTip(t, r.left + r.width / 2, r.top);
    clearTimeout(_hideTimer);
    _hideTimer = setTimeout(hideTip, 4000);
  }, { passive: true });
})();
