import { z } from "zod";

/* ---------------- LOGIN ---------------- */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or username is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

/* ---------------- REGISTER ---------------- */
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required" }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine(
      (email) => email.toLowerCase().endsWith("@gmail.com"),
      { message: "Only Gmail addresses @gmail.com are allowed" }
    ),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),

  referralCode: z
    .string()
    .optional(),
});

/* ---------------- VERIFY EMAIL ---------------- */
export const verifySchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),

  code: z
    .string()
    .regex(/^\d{6}$/, {
      message: "Verification code must be exactly 6 digits",
    }),
});

/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),
});

/* ---------------- RESET PASSWORD ---------------- */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),

    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ---------------- TYPES ---------------- */
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type VerifySchema = z.infer<typeof verifySchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;