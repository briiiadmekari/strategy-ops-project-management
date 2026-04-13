"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { OctagonAlertIcon } from "lucide-react";

interface EmailFormProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  error: string | null;
  countdown: number;
}

export function EmailForm({
  email,
  onEmailChange,
  onSubmit,
  isPending,
  error,
  countdown,
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <Input
          id="email"
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

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isPending || countdown > 0}
      >
        {isPending ? (
          <Spinner className="size-4" />
        ) : countdown > 0 ? (
          `Wait ${countdown}s`
        ) : (
          "Send OTP"
        )}
      </Button>
    </form>
  );
}
