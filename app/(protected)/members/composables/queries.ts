import { useQuery } from '@tanstack/react-query';
import { memberService } from '@/services/member.service';

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => memberService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => memberService.getUsers(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
