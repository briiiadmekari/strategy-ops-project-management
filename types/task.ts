import type { TaskStatus, TaskPriority } from "@/constant/task";
import type { PaginationParams } from "@/types/api";

export interface Subtask {
  id?: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: TaskPriority | null;
  start_date?: string | number | null;
  due_date?: string | number | null;
  is_completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  assignee_id: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
  start_date: string | number | null;
  due_date: string | number | null;
  tags: string[] | null;
  subtasks: Subtask[] | null;
  created_at: string;
  updated_at: string;
}

export interface TaskFilterParams extends PaginationParams {
  status?: TaskStatus;
  assignee_id?: string;
  sort_by_due_date?: "asc" | "desc";
}
