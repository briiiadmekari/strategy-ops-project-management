'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { OctagonAlertIcon } from 'lucide-react';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';

interface EmailFormProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  error: string | null;
  countdown: number;
}

export function EmailForm({ email, onEmailChange, onSubmit, isPending, error, countdown }: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <CustomInput
          label="Work Email"
          type="email"
          required
          disabled={isPending}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="employee@mekari.com"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <CustomButton
        title={isPending ? 'Sending OTP...' : countdown > 0 ? `Wait ${countdown}s` : 'Send OTP'}
        type="submit"
        variant="default"
        size="lg"
        isPending={isPending}
        disabled={isPending || countdown > 0}
        className="w-full"
      />
    </form>
  );
}
