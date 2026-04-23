import api from '@/services';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Task, TaskFilterParams } from '@/types/task';
import type { CreateTaskInput, UpdateTaskInput } from '@/schema/taskSchema';

export const taskService = {
  getMyTasks: (params?: TaskFilterParams) =>
    api.get<ApiResponse<PaginatedResponse<Task>>>('/tasks/me', { params }).then((res) => res.data),

  getAllTasks: (params?: TaskFilterParams) =>
    api.get<ApiResponse<PaginatedResponse<Task>>>('/tasks', { params }).then((res) => res.data),

  getMembers: () => api.get<ApiResponse<Member[]>>('/members').then((res) => res.data),

  getTaskById: (id: string) =>
    api.get<ApiResponse<Task>>(`/tasks/detail`, { params: { id: id } }).then((res) => res.data),

  createTask: (payload: CreateTaskInput) =>
    api.post<ApiResponse<Task>>('/tasks/create', payload).then((res) => res.data),

  updateTask: (id: string, payload: UpdateTaskInput) =>
    api
      .post<ApiResponse<Task>>(`/tasks/update`, payload, {
        params: { id },
      })
      .then((res) => res.data),

  deleteTask: (id: string) =>
    api
      .delete<ApiResponse>(`/tasks/delete`, {
        params: { id: id },
      })
      .then((res) => res.data),
};

export interface Member {
  id: string;
  name: string;
  email: string;
}
