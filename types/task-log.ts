import type { TaskStatus, TaskPriority } from "@/constant/task";
import type { PaginationParams } from "@/types/api";
import type { Subtask } from "@/types/task";

export interface TaskLog {
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
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskLogFilterParams extends PaginationParams {
  assignee_id?: string;
  sort_by_due_date?: "asc" | "desc";
}
