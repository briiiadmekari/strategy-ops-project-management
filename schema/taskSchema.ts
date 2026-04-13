import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(5000).optional(),
  status: z.enum([
    "BACKLOG",
    "NOT_STARTED",
    "IN_PROGRESS",
    "IN_REVIEW",
    "BLOCKED",
    "CANCELED",
    "COMPLETED",
  ]).default("BACKLOG"),
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
