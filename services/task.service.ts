import api from "@/services/axios";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Task, TaskFilterParams } from "@/types/task";
import type { CreateTaskInput, UpdateTaskInput } from "@/schema/taskSchema";

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

  /**
   * GET /tasks/:id
   *
   * Returns a single task by ID.
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Success",
   *   data: Task
   * }
   */
  getTaskById: (id: string) =>
    api
      .get<ApiResponse<Task>>(`/tasks/detail`, { params: { id: id } })
      .then((res) => res.data),

  /**
   * POST /tasks
   *
   * Creates a new task.
   *
   * Request body:
   * {
   *   title: string (required),
   *   description?: string,
   *   status?: "BACKLOG" | "NOT_STARTED" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "CANCELED" | "COMPLETED" (defaults to "BACKLOG"),
   *   assignee?: { id: string, name: string, email: string },
   *   due_date?: string (ISO 8601, e.g. "2026-04-30")
   * }
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Task created successfully",
   *   data: Task
   * }
   */
  createTask: (payload: CreateTaskInput) =>
    api
      .post<ApiResponse<Task>>("/tasks/create", payload)
      .then((res) => res.data),

  /**
   * POST /tasks/update?id=:id
   *
   * Updates a task by ID.
   *
   * Request body: Partial task fields (title, description, status, priority,
   * assignee, start_date, due_date, tags, subtasks, etc.)
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Task updated successfully",
   *   data: Task
   * }
   */
  updateTask: (id: string, payload: UpdateTaskInput) =>
    api
      .post<ApiResponse<Task>>(`/tasks/update`, payload, {
        params: { id },
      })
      .then((res) => res.data),

  /**
   * DELETE /tasks/:id
   *
   * Deletes a task by ID.
   *
   * Expected response:
   * {
   *   error: false,
   *   message: "Task deleted successfully"
   * }
   */
  deleteTask: (id: string) =>
    api
      .delete<ApiResponse>(`/tasks/delete`, {
        params: { id: id },
      })
      .then((res) => res.data),
};

export interface Member {
  id: string;
  name: string;
  email: string;
}
