import { useState } from "react";
import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import { AuthLayout } from "@/layouts";
import { LockIcon } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
import { resetPasswordSchema, type ResetPasswordSchema } from "@/schemas/auth";
import api from "@/config/api";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (!token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Failed to reset password. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onError = (_errors: FieldErrors<ResetPasswordSchema>) => {};

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your new password below"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
        <InputWithIcon
          icon={<LockIcon size={20} />}
          label="New Password"
          type="password"
          placeholder="Create a new password"
          {...register("password")}
          error={errors.password?.message}
        />

        <InputWithIcon
          icon={<LockIcon size={20} />}
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <ButtonWithLoader
          loading={loading}
          initialText="Reset Password"
          loadingText="Resetting..."
          type="submit"
          className="w-full btn-primary h-11 rounded-full"
        />

        <div className="text-center text-muted text-sm">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-primary-2 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}