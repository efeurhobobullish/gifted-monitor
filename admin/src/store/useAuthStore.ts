import { persist } from "zustand/middleware";
import { create } from "zustand";

/** Deferred storage so rehydration runs after first paint - prevents redirect to login on refresh */
function createPersistStorage() {
  return {
    getItem: (key: string): Promise<string | null> =>
      new Promise((resolve) => {
        setTimeout(() => {
          try {
            resolve(localStorage.getItem(key));
          } catch {
            resolve(null);
          }
        }, 0);
      }),
    setItem: (key: string, value: string): void => {
      try {
        localStorage.setItem(key, value);
      } catch {}
    },
    removeItem: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch {}
    },
  };
}

interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  coins: number;
  referralCode: string;
  role: "user" | "admin" | "developer";
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  setAuth: (user: AuthUser, token: string | null) => void;
  setUser: (user: Partial<AuthUser>) => void;
  updateUserCoins: (coins: number) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      /* =====================
         AUTH SET
      ===================== */
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      /* =====================
         USER MERGE UPDATE
      ===================== */
      setUser: (updatedUser) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...updatedUser } });
      },

      /* =====================
         COINS UPDATE ONLY
      ===================== */
      updateUserCoins: (coins) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, coins } });
      },

      /* =====================
         LOGOUT
      ===================== */
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "empirehost-admin-auth-store",
      storage: createPersistStorage(),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (_state, _err) => {
        useAuthStore.setState({ _hasHydrated: true });
      },
    }
  )
);

export default useAuthStore;