import { useTaskById } from "@/composables/queries";

export function useTaskDetailPage(id: string) {
  const taskQuery = useTaskById(id);

  return {
    task: taskQuery.data?.data ?? null,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    error: taskQuery.error,
  };
}
