import { useState } from "react";
import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import InputCheck from "@/components/ui/input-check";
import { AuthLayout } from "@/layouts";
import { UserIcon, LockIcon, ShieldCheck, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginSchema } from "@/schemas/auth";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/config/api";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";

function getLoginErrorMessage(err: any): string {
  if (!err) return "Something went wrong.";
  const msg = err?.response?.data?.message;
  if (msg) return msg;
  const status = err?.response?.status;
  if (status === 401) return "Invalid email/username or password.";
  if (status === 403) return "Please verify your email first.";
  if (status === 400) return "Email/username and password are required.";
  if (status >= 500) return "Server error. Try again later.";
  if (err?.message === "Network Error" || err?.code === "ERR_NETWORK") {
    return "Cannot reach server. Check backend is running on port 4001 and CORS.";
  }
  return err?.message || "Invalid credentials. Please try again.";
}

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

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
        identifier: data.identifier,
        password: data.password,
        remember: saveLogin,
      });

      const { user, token } = res.data;

      setAuth(user, token);

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      const message = getLoginErrorMessage(err);
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
      title="Welcome back to EmpireHost Admin"
      description="Sign in to access the admin dashboard"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
        <InputWithIcon
          icon={<UserIcon size={20} />}
          label="Email or Username"
          type="text"
          id="identifier"
          placeholder="e.g. johndoe or john@gmail.com"
          {...register("identifier")}
          error={errors.identifier?.message}
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
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          <ShieldCheck size={14} className="text-primary" />
          <span>Your session is securely managed</span>
        </div>
      </form>
    </AuthLayout>
  );
}
