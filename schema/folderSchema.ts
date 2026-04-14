import { z } from "zod";

const folderMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),
  members: z.array(folderMemberSchema).optional(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const updateFolderSchema = createFolderSchema.partial();

export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;

export const folderReferenceSchema = z.object({
  id: z.string(),
  name: z.string(),
});
