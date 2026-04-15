export const TASK_STATUSES = [
  "COMPLETED",
  "DONE",
  "CANCELED",
  "FIXING",
  "BLOCKED",
  "IN_REVIEW",
  "IN_PROGRESS",
  "NOT_STARTED",
  "BACKLOG",
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
  DONE: "Done",
  FIXING: "Fixing",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  BACKLOG: "bg-zinc-100 text-zinc-600",
  NOT_STARTED: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-amber-100 text-amber-700",
  BLOCKED: "bg-red-100 text-red-700",
  CANCELED: "bg-zinc-100 text-zinc-400 line-through",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  DONE: "bg-green-100 text-green-700",
  FIXING: "bg-purple-100 text-purple-700",
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

export const TASK_TAGS = [
  "feature",
  "bug",
  "dev",
  "assessment",
  "research",
  "enhancement",
] as const;

export type TaskTag = (typeof TASK_TAGS)[number];

export const TASK_TAG_COLORS: Record<TaskTag, string> = {
  feature: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  bug: "bg-red-100 text-red-700 hover:bg-red-200",
  dev: "bg-violet-100 text-violet-700 hover:bg-violet-200",
  assessment: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  research: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  enhancement: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
};
