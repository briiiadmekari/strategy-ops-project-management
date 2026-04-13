"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter, redirect } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { requestOtpSchema, verifyOtpSchema } from "./schema/loginSchema";
import { useRequestOtp, useVerifyOtp } from "./composables/mutation";
import { useCountdown } from "./hooks/useCountdown";
import { EmailForm } from "./components/EmailForm";
import { OtpForm } from "./components/OtpForm";
import { TOKEN_KEY } from "@/constant/auth";

type Step = "email" | "otp";

const OTP_COOLDOWN_SECONDS = 120;

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export default function LoginPage() {
  const router = useRouter();

  const token = useSyncExternalStore(subscribeToStorage, getToken, () => null);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { countdown, start: startCountdown } = useCountdown();
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  if (token) {
    redirect("/");
  }

  function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError) {
      return (
        err.response?.data?.message ??
        "A network error occurred. Please check your connection and try again."
      );
    }
    return "An unexpected error occurred. Please try again.";
  }

  function handleRequestOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    const result = requestOtpSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (countdown > 0) {
      setError(`Please wait ${countdown} seconds before requesting a new OTP.`);
      return;
    }

    requestOtp.mutate(
      { email },
      {
        onSuccess: () => {
          setStep("otp");
          setOtp("");
          setError(null);
          startCountdown(OTP_COOLDOWN_SECONDS);
          toast.success("OTP sent to your email");
        },
        onError: (err) => {
          setError(getErrorMessage(err));
        },
      },
    );
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = verifyOtpSchema.safeParse({ email, otp });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    verifyOtp.mutate(
      { email, otp },
      {
        onSuccess: (data) => {
          const newToken = data.data?.token;
          if (newToken) {
            sessionStorage.setItem(TOKEN_KEY, newToken);
            toast.success("Signed in successfully");
            router.push("/");
          } else {
            setError("Authentication succeeded, but no token was received.");
          }
        },
        onError: (err) => {
          setError(getErrorMessage(err));
        },
      },
    );
  }

  function handleResendOtp() {
    handleRequestOtp();
  }

  function handleBackToEmail() {
    setStep("email");
    setOtp("");
    setError(null);
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image
            src="/logo-mekari.svg"
            alt="Mekari Logo"
            width={120}
            height={40}
            className="mx-auto mb-2"
            priority
          />
          <CardTitle className="text-xl">
            Strategy Ops Project Management
          </CardTitle>
          <CardDescription>
            Secure access for authorized personnel
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "email" ? (
            <EmailForm
              email={email}
              onEmailChange={setEmail}
              onSubmit={handleRequestOtp}
              isPending={requestOtp.isPending}
              error={error}
              countdown={countdown}
            />
          ) : (
            <OtpForm
              email={email}
              otp={otp}
              onOtpChange={setOtp}
              onSubmit={handleVerifyOtp}
              onResend={handleResendOtp}
              onBackToEmail={handleBackToEmail}
              isPending={verifyOtp.isPending}
              error={error}
              countdown={countdown}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
