import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/layouts";
import { ButtonWithLoader } from "@/components/ui";
import { verifySchema, type VerifySchema } from "@/schemas/auth";
import api from "@/config/api";
import { toast } from "sonner";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  /* ================= VERIFY ================= */
  const onSubmit = async (data: VerifySchema) => {
    if (!email) {
      toast.error("Missing email. Please register again.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify", {
        email,
        code: data.code,
      });

      toast.success("Email verified successfully. You can now login.");
      navigate("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Invalid or expired verification code";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onError = (_errors: FieldErrors<VerifySchema>) => {};

  return (
    <AuthLayout
      title="Verify your account"
      description={`Enter the 6-digit verification code sent to ${email}`}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* 6-digit numeric OTP */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Verification Code
          </label>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            className="w-full h-11 px-4 rounded-lg border border-line bg-background text-main text-center tracking-widest text-lg"
            {...register("code")}
          />

          {errors.code && (
            <p className="text-xs text-red-500 mt-1">
              {errors.code.message}
            </p>
          )}
        </div>

        <ButtonWithLoader
          loading={loading}
          initialText="Verify Account"
          loadingText="Verifying..."
          type="submit"
          className="w-full btn-primary h-11 rounded-full"
        />

        <div className="text-center text-xs text-muted">
          Didn’t receive the code?{" "}
          <button
            type="button"
            onClick={async () => {
              try {
                await api.post("/auth/resend-verification", { email });
                toast.success("Verification code resent");
              } catch {
                toast.error("Failed to resend code");
              }
            }}
            className="text-primary font-semibold hover:underline"
          >
            Resend
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}