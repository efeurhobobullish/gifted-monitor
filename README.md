<h1 align="center">🟢 Gifted Monitor</h1>
<p align="center"><b>24/7 uptime monitoring — email OTP, alerts via WhatsApp, Telegram &amp; email</b></p>
<p align="center"><b>Built by Empire Tech &amp; Gifted Tech</b></p>

<p align="center">
  <a href="https://monitor.giftedtech.co.ke"><img src="https://img.shields.io/badge/LIVE%20APP-monitor.giftedtech.co.ke-green?style=for-the-badge&logo=googlechrome" alt="Live App"/></a>
</p>

<p align="center">
  <a href="https://github.com/efeurhobobullish"><img src="https://img.shields.io/badge/GITHUB-EMPIRE%20TECH-blue?style=for-the-badge&logo=github" alt="Empire Tech on GitHub"/></a>
  <a href="https://github.com/mauricegift"><img src="https://img.shields.io/badge/GITHUB-GIFTED%20TECH-red?style=for-the-badge&logo=github" alt="Gifted Tech on GitHub"/></a>
  <a href="https://github.com/mauricegift/gifted-monitor/stargazers"><img src="https://img.shields.io/github/stars/mauricegift/gifted-monitor?style=social" alt="Stars"/></a>
  <a href="https://github.com/mauricegift/gifted-monitor/network/members"><img src="https://img.shields.io/github/forks/mauricegift/gifted-monitor?style=social" alt="Forks"/></a>
</p>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 1. OVERVIEW

<details>
<summary>TAP TO EXPAND</summary>

**Gifted Monitor** is a full-stack uptime monitoring SaaS. It watches your websites 24/7 and sends alerts when something goes down — and again when it recovers.

**Live at:** [https://monitor.giftedtech.co.ke](https://monitor.giftedtech.co.ke)

| Feature | Details |
|---|---|
| Uptime monitoring | HTTP/HTTPS checks via GET, HEAD, or POST |
| Custom intervals | Per-monitor check intervals (minimum enforced in config) |
| **Signup / OTP** | **Email only** (6-digit code) — requires `EMAIL` + `EMAIL_APP_PASSWORD` (Gmail app password) on the server |
| **Monitor alerts** | User chooses **WhatsApp**, **Telegram**, and/or **HTML email** (`alert_whatsapp`, `alert_telegram`, `alert_email`) |
| JWT auth | 3-day tokens with sliding refresh header |
| Admin panel | Static UI at `backend/public/admin/`; optional React `admin/` app at repo root |
| Super admin | First user to register becomes the platform Super Admin |
| Contact form | Public contact page saves messages to the database |
| Multi-DB support | PostgreSQL, MySQL, or MongoDB adapters |
| Monorepo | `README.md` at repo root only; **`backend/`** holds API + static site; optional **`frontend/`** & **`admin/`** (React + Vite) |
| Mobile-responsive | Hamburger nav, mobile sidebar, full footer on static pages |

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 2. TECH STACK

<details>
<summary>TAP TO EXPAND</summary>

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express 4
- **Database:** PostgreSQL (recommended), MySQL, or MongoDB — chosen from `DATABASE_URL`
- **Auth:** JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`, 12 rounds)
- **HTTP client:** Axios (pinging monitors)
- **Security:** Helmet, express-rate-limit, CORS from `ALLOWED_ORIGINS`
- **Email:** Nodemailer + Gmail app password (`utils/sendEmail.js`, `template/email.js`, `utils/otpEmail.js`)
- **WhatsApp:** Meta WhatsApp Cloud API — **monitoring alerts only** (not signup OTP)
- **Telegram:** Bot API (`libs/telegram.js`) — optional monitor alerts
- **Static frontend:** Vanilla JS, multi-page HTML in `backend/public/`, Tailwind CDN, Font Awesome
- **Optional apps:** React + TypeScript + Vite in `frontend/` and `admin/`

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 3. PROJECT STRUCTURE

<details>
<summary>TAP TO EXPAND</summary>

**Repo root** (documentation only):

```
gifted-monitor/
├── README.md
├── backend/                    # Node API + Gifted Monitor web UI
│   ├── package.json
│   ├── index.js
│   ├── .env                    # from .env.example (not committed)
│   ├── app.json
│   ├── eslint.config.mjs
│   ├── LICENSE
│   ├── config/index.js
│   ├── controllers/            # auth, monitors, admin, contact
│   ├── routes/
│   ├── libs/
│   │   ├── server.js
│   │   ├── auth.js
│   │   ├── ping.js
│   │   ├── whatsapp.js
│   │   ├── telegram.js
│   │   └── notify.js           # routes alerts: WA / Telegram / email
│   ├── middleware/             # cors.js, auth.js
│   ├── model/
│   │   ├── index.js
│   │   └── db/adapters/        # postgres, mysql, mongo
│   ├── template/
│   │   ├── email.js            # HTML emails
│   │   └── whatsapp.js         # Meta template name mapping
│   ├── utils/
│   │   ├── sanitize.js
│   │   ├── sendEmail.js
│   │   └── otpEmail.js         # signup / reset OTP (email only)
│   └── public/                 # landing, auth, monitors, profile, admin HTML, assets
├── frontend/                   # optional React + Vite (see frontend/README.md)
└── admin/                      # optional React + Vite (see admin/README.md)
```

Set **`VITE_BASE_URL`** (no trailing slash) to your backend URL, e.g. `http://localhost:58420`.

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 4. ENVIRONMENT VARIABLES

<details>
<summary>TAP TO EXPAND</summary>

Create a **`.env`** file in the **`backend/`** folder (copy from `backend/.env.example`):

```env
# Server
PORT=58420
NODE_ENV=production

# Database — adapter auto-detected from URL prefix
DATABASE_URL=postgresql://user:password@host/dbname

# Auth — use a strong random string in production
JWT_SECRET=your_strong_random_secret_here

# Email (required for signup / forgot-password / login OTP)
EMAIL=your@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
# Legacy: PASSWORD= also accepted as app password

EMAIL_APP_URL=https://monitor.giftedtech.co.ke
EMAIL_FROM_NAME=Gifted Monitor
EMAIL_LOGO_URL=

# WhatsApp Cloud API (monitor alerts — not OTP)
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=

# WhatsApp template names (must match Meta Business)
WA_TEMPLATE_OTP=gifted_monitor_otp
WA_TEMPLATE_MONITOR_CREATED=gifted_monitor_created
WA_TEMPLATE_SITE_DOWN=gifted_monitor_down
WA_TEMPLATE_SITE_RECOVERED=gifted_monitor_back_online

# Telegram (optional — monitor alerts)
TELEGRAM_BOT_TOKEN=

# Monitoring engine
PING_CHECK_INTERVAL_SECS=10
MIN_PING_INTERVAL_MINS=3

# Timezone (WhatsApp / formatting)
TIMEZONE=Africa/Nairobi

# CORS — comma separated
ALLOWED_ORIGINS=https://monitor.giftedtech.co.ke,https://anotherapp.co.ke
```

> **Security note:** Always override `JWT_SECRET` in production. The default in `config/index.js` is not secure.

> **OTP:** Signup and password flows use **email only**. `WA_TEMPLATE_OTP` remains in config for backwards compatibility but user verification codes are **not** sent via WhatsApp.

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 5. DATABASE SETUP

<details>
<summary>TAP TO EXPAND</summary>

All tables are created automatically on first startup — no manual migrations for base schema. Adapters add columns over time (`ALTER ... IF NOT EXISTS` / safe catches).

**Users** (conceptual): username, email, whatsapp, password hash, verification, roles, avatar, `notify_down` / `notify_up`, **`telegram_chat_id`**, **`alert_whatsapp`** / **`alert_telegram`** / **`alert_email`**, etc.

**Monitors**, **check_history**, **otp_codes**, **contact_messages** — see `backend/model/db/adapters/`.

To switch databases, change **`DATABASE_URL`**:

- `postgresql://` → PostgreSQL  
- `mysql://` → MySQL  
- `mongodb://` or `mongodb+srv://` → MongoDB  

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 6. WHATSAPP CLOUD API SETUP

<details>
<summary>TAP TO EXPAND</summary>

### Step 1 — Create a Meta Business Account

Go to [business.facebook.com](https://business.facebook.com) and create or log in to your Meta Business account.

### Step 2 — Verify Your Account & Business

- Verify your **personal identity** (government-issued ID)
- Verify your **business** with documents as required by Meta  
- You cannot send messages to non-test numbers until approved.

### Step 3 — Create a Developer App

Go to [developers.facebook.com](https://developers.facebook.com), create an app, add the **WhatsApp** product.

### Step 4 — Credentials

- **Access Token** → `WHATSAPP_TOKEN`  
- **Phone Number ID** → `WHATSAPP_PHONE_ID`

### Step 5 — Message Templates (monitoring alerts)

Create templates whose **names** match `WA_TEMPLATE_MONITOR_CREATED`, `WA_TEMPLATE_SITE_DOWN`, `WA_TEMPLATE_SITE_RECOVERED`. Parameters must match what `backend/libs/whatsapp.js` sends.

> Template approval can take 24–48 hours. Alerts log errors if templates are missing or rejected.

> **Monitoring only:** WhatsApp is used for **down / up / monitor-created** alerts when the user enables **`alert_whatsapp`**. It is **not** used for signup OTP (those are **email**).

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 7. EMAIL (GMAIL) SETUP

<details>
<summary>TAP TO EXPAND</summary>

1. Enable **2-Step Verification** on the Google account.  
2. Create a Gmail **App Password** (Security → App passwords).  
3. Set **`EMAIL`** and **`EMAIL_APP_PASSWORD`** in `backend/.env`.

**Used for:**

- **OTP emails** — signup, resend, unverified login, forgot password (`utils/otpEmail.js`).  
- **Optional monitor alerts** — when **`alert_email`** is true (`libs/notify.js` + `template/email.js`).

If email is not configured, signup may return **503** with a clear error until the server is configured.

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 8. TELEGRAM BOT (OPTIONAL)

<details>
<summary>TAP TO EXPAND</summary>

1. Create a bot with **@BotFather** → set **`TELEGRAM_BOT_TOKEN`** in `backend/.env`.  
2. User gets their numeric **chat id** (e.g. from @userinfobot), then calls **`POST /api/auth/telegram-link`** with `{ "chat_id": "..." }` while authenticated.  
3. User must **/start** your bot or Telegram will not deliver messages.  
4. Enable **`alert_telegram`** in **`POST /api/auth/notification-prefs`** to receive **down / up / monitor-created** alerts on Telegram.

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 9. RUNNING THE APP

<details>
<summary>TAP TO EXPAND</summary>

**Backend (required)**

```bash
cd backend
npm install
npm start
```

Default port **`58420`** or **`PORT`** from `.env`.

**Optional — frontend**

```bash
cd frontend
npm install
npm run dev
```

**Optional — admin (React)**

```bash
cd admin
npm install
npm run dev
```

On startup the backend will:

1. Connect to the database and create/update schema as needed  
2. Start Express + static files from `backend/public/`  
3. Start the ping engine — every `PING_CHECK_INTERVAL_SECS` seconds it looks for due monitors  

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 10. AUTHENTICATION SYSTEM

<details>
<summary>TAP TO EXPAND</summary>

- **Registration:** Email + WhatsApp number required on the form. A **6-digit OTP is sent to email** (not WhatsApp). Account stays unverified until OTP is confirmed.  
- **Login:** JWT with 3-day expiry; **`x-refresh-token`** header for sliding refresh when close to expiry.  
- **Password reset:** OTP sent **by email** after forgot-password.  
- **Rate limiting:** Signup, login, OTP endpoints are limited against brute force.  
- **Client storage:** JWT often stored as `gm_token` in `localStorage`.  
- **OTP expiry:** 10 minutes; request a new code via resend if needed.  

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 11. MONITORING ENGINE

<details>
<summary>TAP TO EXPAND</summary>

The ping engine runs on a fixed ticker (`PING_CHECK_INTERVAL_SECS`, default 10s). On each tick it finds monitors that are **due** based on `interval_mins` and `last_checked`.

1. Pings using the monitor’s method (GET / HEAD / POST)  
2. On failure — **waits 8 seconds and retries once** to reduce false alarms  
3. Writes **`check_history`** (last ~60 checks per monitor)  
4. Updates **`uptime_pct`**  
5. Sends alerts through **`libs/notify.js`** according to user **channel** flags and per-monitor **`notify_down` / `notify_up`**  
6. **Still down** reminder every **24 hours** while the incident continues  

**Per-monitor options:** name, URL, path, method, body (POST), interval, `notify_down`, `notify_up`.

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 12. ALERT & NOTIFICATION SYSTEM

<details>
<summary>TAP TO EXPAND</summary>

| Channel | User field | Default | What it sends |
|--------|------------|---------|----------------|
| **WhatsApp** | `alert_whatsapp` | **on** | Meta template messages (down, recovered, monitor created) |
| **Telegram** | `alert_telegram` | **off** | Bot HTML messages (same events) — requires linked `chat_id` |
| **Email** | `alert_email` | **off** | HTML from `template/email.js` |

Per-monitor **`notify_down`** / **`notify_up`** still control whether **that monitor** triggers down/up notifications.

Update globals via **`POST /api/auth/notification-prefs`** with `notify_down`, `notify_up`, `alert_whatsapp`, `alert_telegram`, `alert_email`.

**Signup / login OTP** is **never** sent on these channels — **email only**.

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 13. USER ROLES & PERMISSIONS

<details>
<summary>TAP TO EXPAND</summary>

| Role | How assigned | Capabilities |
|---|---|---|
| **Guest** | Not logged in | Public pages, contact form |
| **User** | Default on signup | Own monitors, profile, notification prefs |
| **Admin** | Promoted by Super Admin | View/manage users, monitors, contact messages |
| **Super Admin** | **First user registered** | Full admin powers + promote/demote admins |

### First user = Super Admin

The **first successful signup** gets `is_admin` and `is_superadmin`. **Register your own account first** after deploy before sharing the URL.

If you lose access, run SQL against your DB, e.g.  
`UPDATE users SET is_admin=true, is_superadmin=true WHERE email='you@example.com';`

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 14. ADMIN PANEL

<details>
<summary>TAP TO EXPAND</summary>

**Built-in static admin** (served by Express): paths under **`/admin/`** in `backend/public/admin/` — requires admin JWT (see your deployed app).

**Optional React admin** at repo root **`admin/`** — run with `npm run dev`, point API to backend (`VITE_BASE_URL`).

| Area | Typical use |
|---|---|
| Dashboard | Stats, users, monitors |
| Users | Search, edit, suspend, roles |
| Monitors | Cross-account monitor view |
| Messages | Contact form inbox |

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 15. API REFERENCE

<details>
<summary>AUTH — /api/auth</summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register — sends **email** OTP |
| POST | `/verify-otp` | No | Verify signup or reset OTP |
| POST | `/resend-otp` | No | Resend **email** OTP |
| POST | `/login` | No | Login; may email OTP if unverified |
| POST | `/forgot-password` | No | Request reset **email** OTP |
| POST | `/reset-password` | No | Set new password |
| POST | `/change-password` | Yes | Change password |
| GET | `/me` | Yes | Profile + `telegram_linked`, `alert_*` |
| POST | `/telegram-link` | Yes | Link/unlink Telegram `chat_id` |
| PUT | `/avatar` | Yes | Update avatar (base64) |
| POST | `/update-whatsapp` | Yes | Change WhatsApp (password required) |
| POST | `/notification-prefs` | Yes | `notify_*`, `alert_whatsapp`, `alert_telegram`, `alert_email` |

</details>

<details>
<summary>MONITORS — /api/monitors</summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | List monitors |
| POST | `/` | Yes | Create monitor |
| GET | `/:id` | Yes | Detail + history |
| PUT | `/:id` | Yes | Update |
| DELETE | `/:id` | Yes | Delete |
| POST | `/:id/ping` | Yes | Manual ping |

</details>

<details>
<summary>ADMIN — /api/admin</summary>

Requires **admin** JWT. Endpoints for stats, users, monitors, contact messages — see `backend/controllers/adminController.js`.

</details>

<details>
<summary>PUBLIC</summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Contact form |
| GET | `/api/status` | Health / uptime JSON |

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## 16. IMPORTANT NOTES

<details>
<summary>TAP TO EXPAND</summary>

**First user is Super Admin** — register immediately after deployment.

**Email is required for OTP** — configure Gmail app password or verification flows return **503**.

**WhatsApp templates** — used for **monitoring alerts** when `alert_whatsapp` is on; **not** for signup codes.

**Telegram** — user must link chat id and enable `alert_telegram`; bot must receive `/start`.

**Monitor retry** — 8s delay + second request before declaring down.

**Uptime %** — derived from recent check history (see adapter logic).

**Avatars** — base64 in DB; keep size reasonable.

**CORS** — set `ALLOWED_ORIGINS` for production frontends.

**CSS** — custom responsive nav in `style.css` works even if Tailwind CDN is slow.

</details>

<img src='https://i.imgur.com/LyHic3i.gif'/>

---

## UPDATES & CONTACT

- **[Contact Support](https://monitor.giftedtech.co.ke/contact/)** — questions, bugs, feedback  
- **[WhatsApp Channel](https://whatsapp.com/channel/0029Vb6lNd511ulWbxu1cT3A)** — updates and announcements  
- **[Empire Tech — portfolio](https://empiretech.net.ng)** — projects &amp; work by Empire Tech  
- **[Gifted Tech — portfolio](https://me.giftedtech.co.ke)** — projects &amp; work by Gifted Tech  

<img src='https://i.imgur.com/LyHic3i.gif'/>
