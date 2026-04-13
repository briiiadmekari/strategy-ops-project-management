import api from "@/services/axios";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

export const authService = {
  /**
   * GET /me
   *
   * Returns the currently authenticated user's profile.
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Success",
   *   data: {
   *     id: string,
   *     name: string,
   *     email: string,
   *     role: "superadmin" | "admin" | "member"
   *   }
   * }
   */
  getMe: () =>
    api.get<ApiResponse<User>>("/me").then((res) => res.data),
};
