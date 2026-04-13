import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import type { TaskFilterParams } from "@/types/task";

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
