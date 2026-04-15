import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { taskLogService } from "@/services/task-log.service";
import { folderService } from "@/services/folder.service";
import { authService } from "@/services/auth.service";
import type { TaskFilterParams } from "@/types/task";
import type { TaskLogFilterParams } from "@/types/task-log";
import type { FolderFilterParams } from "@/types/folder";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMyTasks(params?: TaskFilterParams) {
  return useQuery({
    queryKey: ["tasks", "me", params],
    queryFn: () => taskService.getMyTasks(params),
    placeholderData: keepPreviousData,
  });
}

export function useAllTasks(params?: TaskFilterParams) {
  return useQuery({
    queryKey: ["tasks", "all", params],
    queryFn: () => taskService.getAllTasks(params),
    placeholderData: keepPreviousData,
  });
}

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: () => taskService.getMembers(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTaskById(id: string) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
}

export function useFolders(params?: FolderFilterParams) {
  return useQuery({
    queryKey: ["folders", params],
    queryFn: () => folderService.getFolders(params),
    placeholderData: keepPreviousData,
  });
}

export function useFolderById(id: string) {
  return useQuery({
    queryKey: ["folders", id],
    queryFn: () => folderService.getFolderById(id),
    enabled: !!id,
  });
}

export function useFolderTasks(folderId: string, params?: TaskFilterParams) {
  return useQuery({
    queryKey: ["folders", folderId, "tasks", params],
    queryFn: () => folderService.getFolderTasks(folderId, params),
    enabled: !!folderId,
    placeholderData: keepPreviousData,
  });
}

export function useTaskLogs(params?: TaskLogFilterParams) {
  return useQuery({
    queryKey: ["task-logs", params],
    queryFn: () => taskLogService.getLogs(params),
    placeholderData: keepPreviousData,
  });
}
