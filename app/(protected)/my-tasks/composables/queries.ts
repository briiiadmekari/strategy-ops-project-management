import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { TaskFilterParams } from '@/types/task';

export function useMyTasks(params?: TaskFilterParams) {
  return useQuery({
    queryKey: ['tasks', 'me', params],
    queryFn: () => taskService.getMyTasks(params),
    placeholderData: keepPreviousData,
  });
}
