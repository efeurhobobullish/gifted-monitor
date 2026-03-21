import api from "@/config/api";
import useAuthStore from "@/store/useAuthStore";

export default function useAuth() {
  const {
    setAuth,
    setUser,
    logout,
    user,
    token,
    isAuthenticated,
  } = useAuthStore();

  /* =========================
     🔄 REFRESH FULL USER
  ========================= */
  const refreshUser = async () => {
    if (!token) return;

    try {
      const { data } = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAuth(data.user, token);
    } catch {
      // silent fail (token may be invalid)
    }
  };

  /* =========================
     💰 REFRESH COINS ONLY
  ========================= */
  const refreshPoints = async () => {
    if (!token) return;

    try {
      const { data } = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({ coins: data.user.coins });
    } catch {
      // silent fail
    }
  };

  /* =========================
     🧾 SIGN UP
  ========================= */
  const signup = async (
    fullName: string,
    email: string,
    password: string,
    referralCode?: string
  ) => {
    try {
      const { data } = await api.post("/auth/register", {
        fullName,
        email,
        password,
        referralCode,
      });

      setAuth(data.user, data.token);
      await refreshUser();

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    }
  };

  /* =========================
     🔑 LOGIN
  ========================= */
  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", {
        identifier: email,
        password,
      });

      setAuth(data.user, data.token);
      await refreshUser();

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid credentials",
      };
    }
  };

  /* =========================
     🛡 CHECK SESSION (FIXED)
  ========================= */
  const checkSession = async () => {
    if (!token) return null;

    try {
      const { data } = await api.get("/auth/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAuth(data.user, token);
      return data.user;
    } catch {
      logout();
      return null;
    }
  };

  return {
    signup,
    login,
    checkSession,
    refreshUser,
    refreshPoints,
    logout,
    user,
    token,
    isAuthenticated,
    setUser,
  };
}