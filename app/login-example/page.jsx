"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EmailForm from "./_components/EmailForm";
import OtpForm from "./_components/OtpForm";

export default function LoginPage() {
  const router = useRouter();

  // --- UI STATES ---
  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Added to prevent login form flash

  // --- LOGIC STATES ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // --- CHECK EXISTING AUTH ---
  useEffect(() => {
    const token = localStorage.getItem("portal_jwt_token");
    if (token) {
      router.replace("/"); // Redirect to home immediately
    } else {
      setIsCheckingAuth(false); // No token found, reveal the login form
    }
  }, [router]);

  // --- COUNTDOWN EFFECT ---
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // --- API: REQUEST OTP ---
  const handleRequestOTP = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email.includes("@mekari.com")) {
      setError("Please use a valid @mekari.com email address.");
      return;
    }

    if (countdown > 0) {
      setError(`Please wait ${countdown} seconds before requesting a new OTP.`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_COMPANY_ID}/internal-ai-portal/sign-in/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const result = await response.json();

      if (response.ok && !result.error) {
        // Success: 200 OTP Sent
        setStep("OTP");
        setCountdown(120); // Updated to 2 minutes as per rate limit spec
        setOtp("");
      } else {
        // Error: 400 Rate Limit or other errors
        setError(result.message || "Failed to request OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP Request Error:", err);
      setError(
        "A network error occurred. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- API: SUBMIT OTP ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_COMPANY_ID}/internal-ai-portal/sign-in/submit-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        },
      );

      const result = await response.json();

      if (response.ok && !result.error) {
        // Success: 200 Success sign-in
        const token = result.data?.token;
        if (token) {
          // Store the JWT token for CSR usage
          localStorage.setItem("portal_jwt_token", token);
          router.push("/");
        } else {
          setError("Authentication succeeded, but no token was received.");
        }
      } else {
        // Error: 401 Invalid OTP or Blocked due to attempts
        setError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError(
        "A network error occurred. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("EMAIL");
    setOtp("");
    setError("");
  };

  // While checking local storage, return null (or a loader) so the login UI doesn't flash
  if (isCheckingAuth) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] flex items-start sm:items-center justify-center p-4 pt-[10vh] sm:pt-4">
      <div className="relative bg-white border border-gray-100 w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col items-center">
        {/* LOGO & HEADER */}
        <div className="mb-6 sm:mb-8 w-full flex flex-col items-center">
          <img
            src="/logo-mekari.svg"
            alt="Mekari Logo"
            className="h-8 sm:h-10 w-auto mb-3 sm:mb-4"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 className="text-lg sm:text-xl font-bold text-[#160C2C] tracking-wide text-center">
            Mekari Internal AI Portal
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1 sm:mt-2 text-center">
            Secure access for authorized personnel
          </p>
        </div>

        {step === "EMAIL" ? (
          <EmailForm
            email={email}
            setEmail={setEmail}
            isLoading={isLoading}
            error={error}
            countdown={countdown}
            handleRequestOTP={handleRequestOTP}
          />
        ) : (
          <OtpForm
            email={email}
            otp={otp}
            setOtp={setOtp}
            isLoading={isLoading}
            error={error}
            countdown={countdown}
            handleVerifyOTP={handleVerifyOTP}
            handleRequestOTP={handleRequestOTP}
            onBackToEmail={handleBackToEmail}
          />
        )}
      </div>
    </div>
  );
}
