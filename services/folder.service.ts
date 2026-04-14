import api from "@/services/axios";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Folder, FolderFilterParams } from "@/types/folder";
import type { Task, TaskFilterParams } from "@/types/task";
import type { CreateFolderInput, UpdateFolderInput } from "@/schema/folderSchema";

export const folderService = {
  /**
   * GET /folders
   */
  getFolders: (params?: FolderFilterParams) =>
    api
      .get<ApiResponse<PaginatedResponse<Folder>>>("/folders", { params })
      .then((res) => res.data),

  /**
   * GET /folders/detail?id=:id
   */
  getFolderById: (id: string) =>
    api
      .get<ApiResponse<Folder>>("/folders/detail", { params: { id } })
      .then((res) => res.data),

  /**
   * GET /folders/:id/tasks
   */
  getFolderTasks: (folderId: string, params?: TaskFilterParams) =>
    api
      .get<ApiResponse<PaginatedResponse<Task>>>(`/folders/tasks`, {
        params: { folder_id: folderId, ...params },
      })
      .then((res) => res.data),

  /**
   * POST /folders/create
   */
  createFolder: (payload: CreateFolderInput) =>
    api
      .post<ApiResponse<Folder>>("/folders/create", payload)
      .then((res) => res.data),

  /**
   * POST /folders/update?id=:id
   */
  updateFolder: (id: string, payload: UpdateFolderInput) =>
    api
      .post<ApiResponse<Folder>>("/folders/update", payload, {
        params: { id },
      })
      .then((res) => res.data),

  /**
   * DELETE /folders/delete?id=:id
   */
  deleteFolder: (id: string) =>
    api
      .delete<ApiResponse>("/folders/delete", { params: { id } })
      .then((res) => res.data),
};
