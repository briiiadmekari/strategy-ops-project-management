"use client";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { useDeleteTask } from "@/composables/mutations";

export function useDeleteTaskDialog(taskId: string) {
  const deleteTask = useDeleteTask();

  function handleDelete() {
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        toast.success("Task deleted");
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message ?? "Failed to delete task",
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      },
    });
  }

  return {
    isPending: deleteTask.isPending,
    handleDelete,
  };
}
