import api from "@/services/axios";
import type { ApiResponse } from "@/types/api";
import type { Member } from "@/services/task.service";

export interface MasterUser {
  id: string;
  name: string;
  email: string;
}

export const memberService = {
  /**
   * GET /members
   *
   * Returns all team members.
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Success",
   *   data: [{ id: string, name: string, email: string }]
   * }
   */
  getAll: () =>
    api.get<ApiResponse<Member[]>>("/members").then((res) => res.data),

  /**
   * GET /get-users
   *
   * Returns all users from master data for selection.
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Success",
   *   data: [{ id: string, name: string, email: string }]
   * }
   */
  getUsers: () =>
    api.get<ApiResponse<MasterUser[]>>("/get-users").then((res) => res.data),

  /**
   * POST /members
   *
   * Adds a user as a team member by their user ID.
   *
   * Request body:
   * {
   *   user_id: string (required, UUID)
   * }
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Member created successfully",
   *   data: { id: string, name: string, email: string }
   * }
   */
  create: (payload: { user_id: string }) =>
    api.post<ApiResponse<Member>>("/members/create", payload).then((res) => res.data),
};
