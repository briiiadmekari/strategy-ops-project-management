import type { TaskStatus } from "@/constant/task";
import type { PaginationParams } from "@/types/api";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: string | null;
  assignee_id: string | null;
  assignee_name: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskFilterParams extends PaginationParams {
  status?: TaskStatus;
  assignee_id?: string;
  sort_by_due_date?: "asc" | "desc";
}
