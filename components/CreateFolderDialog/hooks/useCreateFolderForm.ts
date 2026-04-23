'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { z } from 'zod';
import type { UseMutationResult } from '@tanstack/react-query';

import { createFolderSchema } from '@/schema/folderSchema';
import { useCreateFolder } from '@/composables/mutations';
import { useMembers } from '@/composables/queries';
import type { ApiResponse } from '@/types/api';
import type { Folder } from '@/types/folder';

type CreateFolderForm = z.infer<typeof createFolderSchema>;

const DEFAULT_VALUES: CreateFolderForm = {
  name: '',
  members: [],
};

interface HandleCreateFolderParams {
  form: UseFormReturn<CreateFolderForm>;
  mutate: UseMutationResult<ApiResponse<Folder>, Error, CreateFolderForm, unknown>['mutate'];
  setOpen: (open: boolean) => void;
}

async function handleCreateFolder({ form, mutate, setOpen }: HandleCreateFolderParams) {
  const data = form.getValues();
  mutate(data, {
    onSuccess: () => {
      toast.success('Folder created');
      setOpen(false);
      form.reset({ ...DEFAULT_VALUES });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message ?? 'Failed to create folder');
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });
}

export function useCreateFolderForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createFolderSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFolderSchema as any),
    defaultValues: { ...DEFAULT_VALUES },
  });

  const { mutate: createFolder, isPending, isError } = useCreateFolder();
  const {
    data: membersData,
    isPending: isMembersPending,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useMembers();
  const members = membersData?.data ?? [];

  function toggleMember(memberId: string) {
    const current = form.getValues('members') ?? [];
    const exists = current.some((m) => m.id === memberId);
    if (exists) {
      form.setValue(
        'members',
        current.filter((m) => m.id !== memberId),
      );
    } else {
      const member = members.find((m) => m.id === memberId);
      if (member) {
        form.setValue('members', [...current, { id: member.id, name: member.name, email: member.email }]);
      }
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) form.reset({ ...DEFAULT_VALUES });
  }

  return {
    open,
    form,
    members,
    isPending,
    handleOpenChange,
    toggleMember,
    handleSubmit: form.handleSubmit(
      async () =>
        await handleCreateFolder({
          form,
          mutate: createFolder,
          setOpen,
        }),
      (err) => {
        console.log(err);
      },
    ),
  };
}
