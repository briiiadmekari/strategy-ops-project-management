import { z } from "zod";

export const createMemberSchema = z.object({
  user_id: z.string().min(1, "Please select a user"),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
