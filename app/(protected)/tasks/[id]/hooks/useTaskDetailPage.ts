import { useTaskById } from "@/composables/queries";
import { useUpdateTask } from "@/composables/mutations";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { TaskStatus } from "@/constant/task";

export function useTaskDetailPage(id: string) {
  const taskQuery = useTaskById(id);
  const updateTask = useUpdateTask();

  function handleStatusChange(newStatus: string) {
    updateTask.mutate(
      { id, payload: { status: newStatus as TaskStatus } },
      {
        onSuccess: () => {
          toast.success("Status updated");
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message ?? "Failed to update status");
          } else {
            toast.error("An unexpected error occurred");
          }
        },
      },
    );
  }

  return {
    task: taskQuery.data?.data ?? null,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    error: taskQuery.error,
    isUpdating: updateTask.isPending,
    handleStatusChange,
  };
}
