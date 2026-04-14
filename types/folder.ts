import type { PaginationParams } from "@/types/api";

export interface FolderMember {
  id: string;
  name: string;
  email: string;
}

export interface Folder {
  id: string;
  name: string;
  members: FolderMember[];
  creator: {
    id: string;
    name: string;
    email: string;
  }
  created_at: string;
  updated_at: string;
}

export interface FolderReference {
  id: string;
  name: string;
}

export interface FolderFilterParams extends PaginationParams {}
