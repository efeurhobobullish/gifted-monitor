import { useState } from "react";
import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import InputCheck from "@/components/ui/input-check";
import { AuthLayout } from "@/layouts";
import { Mail, LockIcon, ShieldCheck, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginSchema } from "@/schemas/auth";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/config/api";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const [loading, setLoading] = useState(false);
  const [saveLogin, setSaveLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setErrorMessage(null);

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        identifier: data.email.trim().toLowerCase(),
        password: data.password,
        remember: saveLogin,
      });

      const { user: u, token } = res.data;

      setUser({
        _id: String(u.id),
        fullName: u.name ?? "",
        email: u.email,
        coins: 0,
        referralCode: u.referral_code,
        role: u.is_superadmin ? "admin" : "user",
      });
      setToken(token);

      toast.success("Welcome back");
      navigate("/dashboard");

    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Login failed";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onError = (_errors: FieldErrors<LoginSchema>) => {
    setErrorMessage(null);
  };

  return (
    <AuthLayout
      variant="login"
      title="Welcome back"
      description="Sign in with your email and password to open your dashboard."
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
        <InputWithIcon
          icon={<Mail size={20} />}
          label="Email"
          type="email"
          id="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <InputWithIcon
          icon={<LockIcon size={20} />}
          label="Password"
          type="password"
          id="password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <InputCheck
              checked={saveLogin}
              id="remember"
              accent="bg-primary-2"
              className="text-white dark:text-[#171717]"
              onChange={(e) => setSaveLogin(e.target.checked)}
            />
            <label htmlFor="remember">Keep me signed in</label>
          </div>

          <Link to="/forgot-password" className="text-primary-2">
            Forgot password?
          </Link>
        </div>

        <ButtonWithLoader
          loading={loading}
          initialText="Sign In"
          loadingText="Signing in..."
          type="submit"
          className="w-full btn-primary h-11 rounded-full"
        />

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          <ShieldCheck size={14} className="text-primary" />
          <span>Your session is securely managed</span>
        </div>

        <div className="text-center text-muted text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
