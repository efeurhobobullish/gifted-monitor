import axios from "axios";
import { useAuthStore } from "@/store";

/* =========================
   BACKEND URL (single source of truth)
   Admin can override via Dashboard → API Settings (saved in localStorage)
========================= */
const STORAGE_KEY = "ADMIN_API_BASE_URL";

function getBackendBaseUrl(): string {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const storedUrl = stored?.trim().replace(/\/+$/, "");
  if (storedUrl) return storedUrl;

  const raw = import.meta.env.VITE_BASE_URL;
  const url = typeof raw === "string" && raw.trim() ? raw.trim().replace(/\/+$/, "") : "";
  if (url) return url;
  if (import.meta.env.DEV) return "https://empirehost-backend-d563ca7f1bbc.herokuapp.com";
  return "";
}

export function getStoredApiBaseUrl(): string | null {
  return typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
}

export function setStoredApiBaseUrl(value: string): void {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (typeof localStorage !== "undefined") {
    if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed);
    else localStorage.removeItem(STORAGE_KEY);
  }
}

const BACKEND_BASE_URL = getBackendBaseUrl();
const API_BASE_URL = BACKEND_BASE_URL ? `${BACKEND_BASE_URL}/api` : "/api";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on invalid / expired token
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
export { BACKEND_BASE_URL, API_BASE_URL };
