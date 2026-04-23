import { useMutation } from '@tanstack/react-query';
import { loginService } from '@/services/login.service';
import type { RequestOtpInput, VerifyOtpInput } from '../schema/loginSchema';

export function useRequestOtp() {
  return useMutation({
    mutationFn: (payload: RequestOtpInput) => loginService.requestOtp(payload),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpInput) => loginService.verifyOtp(payload),
  });
}
