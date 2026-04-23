import api from '@/services';
import type { ApiResponse } from '@/types/api';
import type { Member } from '@/services/task.service';
import { MasterUser } from '@/app/(protected)/members/composables/interface';

export const memberService = {
  getAll: () => api.get<ApiResponse<Member[]>>('/members').then((res) => res.data),

  getUsers: () => api.get<ApiResponse<MasterUser[]>>('/get-users').then((res) => res.data),

  create: (payload: { user_id: string }) =>
    api.post<ApiResponse<Member>>('/members/create', payload).then((res) => res.data),
};
