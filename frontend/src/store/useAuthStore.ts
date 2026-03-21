import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  coins: number;
  referralCode?: string;
  role?: "user" | "admin" | "developer";
}

interface AuthStore {
  token: string | null;
  user: User | null;

  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
