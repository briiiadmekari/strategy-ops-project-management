import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/member.service';

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { user_id: string }) => memberService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}
