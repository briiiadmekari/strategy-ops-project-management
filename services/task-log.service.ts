import api from '@/services';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { TaskLog, TaskLogFilterParams } from '@/types/task-log';

export const taskLogService = {
  getLogs: (params?: TaskLogFilterParams) =>
    api.get<ApiResponse<PaginatedResponse<TaskLog>>>('/tasks/logs', { params }).then((res) => res.data),
};
