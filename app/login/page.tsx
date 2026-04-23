'use client';

import Image from 'next/image';
import { useLogin } from './hooks/useLogin';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

import { EmailForm } from './components/EmailForm';
import { OtpForm } from './components/OtpForm';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function LoginPage() {
  const {
    isCheckingAuth,
    step,
    email,
    setEmail,
    otp,
    setOtp,
    error,
    countdown,
    handleRequestOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleBackToEmail,
    isRequestOtpPending,
    isVerifyOtpPending,
  } = useLogin();

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image src="/logo-mekari.svg" alt="Mekari Logo" width={120} height={40} className="mx-auto mb-2" priority />
          <CardTitle className="text-xl">Kodo - Login</CardTitle>
          <CardDescription>
            Sign in with your email to receive a one-time password (OTP) for secure access to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'email' ? (
            <EmailForm
              email={email}
              onEmailChange={setEmail}
              onSubmit={handleRequestOtp}
              isPending={isRequestOtpPending}
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
              isPending={isVerifyOtpPending}
              error={error}
              countdown={countdown}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
