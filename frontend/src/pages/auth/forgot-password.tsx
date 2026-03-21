import { useState } from "react";
import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import { AuthLayout } from "@/layouts";
import { MailIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/schemas/auth";
import api from "@/config/api";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      setLoading(true);

      await api.post("/auth/forgot-password", data);

      toast.success("Password reset link sent to your email");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Failed to send reset link. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onError = (_errors: FieldErrors<ForgotPasswordSchema>) => {};

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email address and we'll send you a reset link"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
        <InputWithIcon
          icon={<MailIcon size={20} />}
          label="Email"
          type="email"
          id="email"
          placeholder="e.g. example@gmail.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <ButtonWithLoader
          loading={loading}
          initialText="Send Reset Link"
          loadingText="Sending..."
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