import api from '@/services';
import type { RequestOtpInput, VerifyOtpInput } from '@/app/login/schema/loginSchema';
import { ApiResponse, VerifyOtpResponse } from '@/app/login/composables/interface';

export const loginService = {
  requestOtp: (payload: RequestOtpInput) =>
    api.post<ApiResponse>('/sign-in/request-otp', payload).then((res) => res.data),

  verifyOtp: (payload: VerifyOtpInput) =>
    api.post<ApiResponse<VerifyOtpResponse>>('/sign-in/submit-otp', payload).then((res) => res.data),
};
