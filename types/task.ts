import type { TaskStatus, TaskPriority } from "@/constant/task";
import type { PaginationParams } from "@/types/api";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  assignee_id: string | null;
  assignee_name: string | null;
  start_date: string | null;
  due_date: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface TaskFilterParams extends PaginationParams {
  status?: TaskStatus;
  assignee_id?: string;
  sort_by_due_date?: "asc" | "desc";
}
