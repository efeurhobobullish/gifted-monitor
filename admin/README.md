# EmpireHost Admin

Admin app: sign-in only, dashboard, bots, and **API Settings** to set/update the backend (Heroku) API URL from the UI.

## Stack

Same as frontend: React 19, TypeScript, Vite 7, Tailwind CSS, React Router, Zustand, Axios.

## Scripts

- `npm run dev` – Dev server (port 3001).
- `npm run build` – Production build (`dist/`).
- `npm run preview` – Preview production build.
- `npm start` – Serve `dist/` (uses `PORT` from env for Heroku).

## Env

Create `.env` from `.env.example`:

- `VITE_BASE_URL` – Backend API base URL (optional; can be set in Dashboard → API Settings and stored in browser).

## API Settings

From the dashboard menu: **API Settings**. Enter your Heroku (or any) backend URL, save, and the app reloads using that API. Stored in `localStorage` (`ADMIN_API_BASE_URL`).

## Deploy

Build with optional `VITE_BASE_URL`, then serve `dist/`. Add admin URL to backend `CORS_ORIGIN`. See root [DEPLOY.md](../DEPLOY.md).
