# Gifted Monitor frontend

User-facing React app: landing, auth, and dashboard (legacy EmpireHost routes are being aligned with the Gifted Monitor API).

## Stack

- React 19, TypeScript, Vite 7, Tailwind CSS, React Router, Zustand, Axios.

## Scripts

- `npm run dev` – Dev server (port 3000).
- `npm run build` – Production build (`dist/`).
- `npm run preview` – Preview production build.
- `npm start` – Serve `dist/` (uses `PORT` from env for Heroku).

## Env

Create `.env` from `.env.example` (if present):

- `VITE_BASE_URL` – Backend API base URL (e.g. `http://localhost:4001` or your deployed API).
- `VITE_PAYSTACK_PUBLIC_KEY` – Optional, for payments.

Build-time only; change requires rebuild.

## Deploy

Build with `VITE_BASE_URL` set to your production API, then serve `dist/`.
