'use client';

import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useDeleteTask } from '@/composables/mutations';

export function useDeleteTaskDialog(taskId: string) {
  const { mutate: deleteTask, isPending, isError } = useDeleteTask();

  function handleDelete() {
    deleteTask(taskId, {
      onSuccess: () => {
        toast.success('Task deleted');
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? 'Failed to delete task');
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    });
  }

  return {
    isPending,
    handleDelete,
  };
}
