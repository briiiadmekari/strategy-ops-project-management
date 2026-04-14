import { z } from "zod";

const assigneeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

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
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).optional(),
  assignee: assigneeSchema.optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
