export const TASK_STATUSES = [
  "BACKLOG",
  "NOT_STARTED",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "CANCELED",
  "COMPLETED",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  BLOCKED: "Blocked",
  CANCELED: "Canceled",
  COMPLETED: "Completed",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  BACKLOG: "bg-zinc-100 text-zinc-600",
  NOT_STARTED: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-amber-100 text-amber-700",
  BLOCKED: "bg-red-100 text-red-700",
  CANCELED: "bg-zinc-100 text-zinc-400 line-through",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

export const TASK_PRIORITIES = [
  "URGENT",
  "HIGH",
  "MEDIUM",
  "LOW",
] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  URGENT: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};
