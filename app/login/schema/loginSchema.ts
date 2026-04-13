import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((val) => val.endsWith("@mekari.com"), {
      message: "Please use a valid @mekari.com email address",
    }),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .length(6, "Please enter the full 6-digit OTP")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
