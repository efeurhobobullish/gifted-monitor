import { useEffect, useState } from "react";
import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import { AuthLayout } from "@/layouts";
import { registerSchema, type RegisterSchema } from "@/schemas/auth";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, AtSign, Mail, Lock, Gift } from "lucide-react";
import api from "@/config/api";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // ✅ get referral code from URL (?ref=XXXX)
  const referralFromUrl = searchParams.get("ref");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  /* ===============================
     AUTO-FILL REFERRAL CODE
  =============================== */
  useEffect(() => {
    if (referralFromUrl) {
      setValue("referralCode", referralFromUrl, {
        shouldValidate: true,
      });
    }
  }, [referralFromUrl, setValue]);

  /* ===============================
     SUBMIT
  =============================== */
  const onSubmit = async (data: RegisterSchema) => {
    try {
      setLoading(true);

      await api.post("/auth/register", data);

      toast.success("Account created successfully. Please verify your email.");

      navigate(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 429) {
        toast.error("You have already registered from this IP address.");
      } else if (message) {
        toast.error(message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onError = (_errors: FieldErrors<RegisterSchema>) => {};

  return (
    <AuthLayout
      title="Create your EmpireHost account"
      description="Set up your account to deploy and manage automation"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <InputWithIcon
            icon={<User size={18} />}
            label="Full Name"
            type="text"
            placeholder="e.g. John Doe"
            {...register("fullName")}
            error={errors.fullName?.message}
          />

          {/* Username */}
          <InputWithIcon
            icon={<AtSign size={18} />}
            label="Username"
            type="text"
            placeholder="e.g. johndoe"
            {...register("username")}
            error={errors.username?.message}
          />

          {/* Email */}
          <InputWithIcon
            icon={<Mail size={18} />}
            label="Email Address"
            type="email"
            placeholder="e.g. john@gmail.com"
            {...register("email")}
            error={errors.email?.message}
          />

          {/* Password */}
          <InputWithIcon
            icon={<Lock size={18} />}
            label="Password"
            type="password"
            placeholder="Create a secure password"
            {...register("password")}
            error={errors.password?.message}
          />

          {/* Referral Code */}
          <InputWithIcon
            icon={<Gift size={18} />}
            label="Referral Code"
            type="text"
            placeholder="Optional"
            {...register("referralCode")}
            error={errors.referralCode?.message}
            disabled={!!referralFromUrl} // ✅ LOCK if from URL
          />
        </div>

        <ButtonWithLoader
          loading={loading}
          initialText="Create Account"
          loadingText="Creating account..."
          type="submit"
          className="w-full btn-primary h-11 rounded-full"
        />

        <div className="text-center text-muted text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
