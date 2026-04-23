import api from '@/services';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

export const authService = {
  getMe: () => api.get<ApiResponse<User>>('/me').then((res) => res.data),
};
