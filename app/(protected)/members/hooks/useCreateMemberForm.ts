'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { z } from 'zod';
import type { UseMutationResult } from '@tanstack/react-query';

import { createMemberSchema } from '../schema/memberSchema';
import { useCreateMember } from '../composables/mutations';
import { useUsers } from '../composables/queries';
import type { ApiResponse } from '@/types/api';
import type { Member } from '@/services/task.service';

interface HandleCreateMemberParams {
  form: UseFormReturn<z.infer<typeof createMemberSchema>>;
  mutate: UseMutationResult<ApiResponse<Member>, Error, { user_id: string }, unknown>['mutate'];
  setOpen: (open: boolean) => void;
}

async function handleCreateMember({ form, mutate, setOpen }: HandleCreateMemberParams) {
  const data = form.getValues();
  mutate(data, {
    onSuccess: () => {
      toast.success('Member added');
      setOpen(false);
      form.reset({ user_id: '' });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message ?? 'Failed to add member');
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });
}

export function useCreateMemberForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createMemberSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createMemberSchema as any),
    defaultValues: { user_id: '' },
  });

  const { mutate: createMember, isPending, isError } = useCreateMember();
  const { data: usersData, isPending: isUsersPending, isLoading: isUsersLoading, isError: isUsersError } = useUsers(open);
  const users = usersData?.data ?? [];

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) form.reset({ user_id: '' });
  }

  return {
    open,
    form,
    users,
    isUsersLoading,
    isPending,
    handleOpenChange,
    handleSubmit: form.handleSubmit(
      async () =>
        await handleCreateMember({
          form,
          mutate: createMember,
          setOpen,
        }),
      (err) => {
        console.log(err);
      },
    ),
  };
}
