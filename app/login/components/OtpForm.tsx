'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OctagonAlertIcon, ArrowLeft } from 'lucide-react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CustomButton } from '@/components/CustomButton';

interface OtpFormProps {
  email: string;
  otp: string;
  onOtpChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onBackToEmail: () => void;
  isPending: boolean;
  error: string | null;
  countdown: number;
}

export function OtpForm({
  email,
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  onBackToEmail,
  isPending,
  error,
  countdown,
}: OtpFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground">We sent a 6-digit code to</p>
        <p className="text-sm font-semibold text-primary mt-0.5 break-all">{email}</p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={onOtpChange} disabled={isPending} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CustomButton
        title={isPending ? 'Verifying...' : 'Verify & Sign In'}
        type="submit"
        variant="default"
        size="lg"
        isPending={isPending}
        disabled={isPending || otp.length < 6}
        className="w-full"
      />

      <div className="text-center space-y-2 pt-1">
        <CustomButton
          title={countdown > 0 ? `Resend available in ${countdown}s` : "Didn't receive a code? Resend"}
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResend}
          disabled={countdown > 0 || isPending}
        />

        <div>
          <CustomButton
            title="Use a different email"
            type="button"
            variant="link"
            size="sm"
            onClick={onBackToEmail}
            leftIcon={<ArrowLeft size={8} />}
          />
        </div>
      </div>
    </form>
  );
}
