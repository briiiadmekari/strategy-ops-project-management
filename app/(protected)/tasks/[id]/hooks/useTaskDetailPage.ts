import { useTaskById } from '@/composables/queries';
import { useUpdateTask } from '@/composables/mutations';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import type { TaskStatus } from '@/constant/task';

export function useTaskDetailPage(id: string) {
  const { data: taskData, isPending: isTaskPending, isLoading, isError, error } = useTaskById(id);
  const { mutate: updateTask, isPending: isUpdating, isError: isUpdateError } = useUpdateTask();

  function handleStatusChange(newStatus: string) {
    updateTask(
      { id, payload: { status: newStatus as TaskStatus } },
      {
        onSuccess: () => {
          toast.success('Status updated');
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message ?? 'Failed to update status');
          } else {
            toast.error('An unexpected error occurred');
          }
        },
      },
    );
  }

  return {
    task: taskData?.data ?? null,
    isLoading,
    isError,
    error,
    isUpdating,
    handleStatusChange,
  };
}
