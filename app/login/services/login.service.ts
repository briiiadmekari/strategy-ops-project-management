import api from "@/services/axios";
import type { RequestOtpInput, VerifyOtpInput } from "../schema/loginSchema";

interface ApiResponse<T = unknown> {
  error: boolean;
  message: string;
  data?: T;
}

interface VerifyOtpResponse {
  token: string;
}

export const loginService = {
  requestOtp: (payload: RequestOtpInput) =>
    api
      .post<ApiResponse>("/sign-in/request-otp", payload)
      .then((res) => res.data),

  verifyOtp: (payload: VerifyOtpInput) =>
    api
      .post<ApiResponse<VerifyOtpResponse>>(
        "/sign-in/submit-otp",
        payload,
      )
      .then((res) => res.data),
};
