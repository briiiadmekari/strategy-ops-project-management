import api from "@/services/axios";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Task, TaskFilterParams } from "@/types/task";

export const taskService = {
  /**
   * GET /tasks/me
   *
   * Returns tasks assigned to the current authenticated user.
   *
   * Query params:
   *   - page: number (default: 1)
   *   - limit: number (default: 10, options: 10 | 20 | 30 | 50)
   *   - status?: "BACKLOG" | "NOT_STARTED" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "CANCELED" | "COMPLETED"
   *   - sort_by_due_date?: "asc" | "desc"
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Success",
   *   data: {
   *     items: Task[],
   *   },
   *  metadata: {
   *   total: number,
   *   page: number,
   *   limit: number,
   *   total_pages: number
   * }
   */
  getMyTasks: (params?: TaskFilterParams) =>
    api
      .get<ApiResponse<PaginatedResponse<Task>>>("/tasks/me", { params })
      .then((res) => res.data),

  /**
   * GET /tasks
   *
   * Returns all tasks across the team.
   *
   * Query params:
   *   - page: number (default: 1)
   *   - limit: number (default: 10, options: 10 | 20 | 30 | 50)
   *   - status?: "BACKLOG" | "NOT_STARTED" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "CANCELED" | "COMPLETED"
   *   - assignee_id?: string (UUID of the assignee to filter by)
   *   - sort_by_due_date?: "asc" | "desc"
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Success",
   *   data: {
   *     items: Task[],
   *     
   *   }
   *   metadata: {
   *    total: number,
   *    page: number,
   *    limit: number,
   *    total_pages: number
   *  }
   * }
   */
  getAllTasks: (params?: TaskFilterParams) =>
    api
      .get<ApiResponse<PaginatedResponse<Task>>>("/tasks", { params })
      .then((res) => res.data),

  /**
   * GET /members
   *
   * Returns all team members for the assignee filter dropdown.
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Success",
   *   data: [
   *     { id: string, name: string, email: string }
   *   ]
   * }
   */
  getMembers: () =>
    api
      .get<ApiResponse<Member[]>>("/members")
      .then((res) => res.data),
};

export interface Member {
  id: string;
  name: string;
  email: string;
}
