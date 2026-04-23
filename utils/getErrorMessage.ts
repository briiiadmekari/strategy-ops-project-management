import { AxiosError } from 'axios';

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    return err.response?.data?.message ?? 'A network error occurred. Please check your connection and try again.';
  }
  return 'An unexpected error occurred. Please try again.';
};
