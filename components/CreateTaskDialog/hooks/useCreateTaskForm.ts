'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { z } from 'zod';
import type { UseMutationResult } from '@tanstack/react-query';

import { createTaskSchema } from '@/schema/taskSchema';
import { useCreateTask } from '@/composables/mutations';
import { useMembers, useFolders } from '@/composables/queries';
import type { ApiResponse } from '@/types/api';
import type { Task } from '@/types/task';

type CreateTaskForm = z.infer<typeof createTaskSchema>;

const DEFAULT_VALUES: CreateTaskForm = {
  title: '',
  description: '',
  status: 'BACKLOG',
  priority: undefined,
  assignee: { id: '', name: '', email: '' },
  start_date: undefined,
  due_date: undefined,
  tags: [],
  folders: [],
};

interface HandleCreateTaskParams {
  form: UseFormReturn<CreateTaskForm>;
  mutate: UseMutationResult<ApiResponse<Task>, Error, CreateTaskForm, unknown>['mutate'];
  setOpen: (open: boolean) => void;
  defaultFolders?: { id: string; name: string }[];
}

async function handleCreateTask({ form, mutate, setOpen, defaultFolders }: HandleCreateTaskParams) {
  const data = form.getValues();
  mutate(data, {
    onSuccess: () => {
      toast.success('Task created');
      setOpen(false);
      form.reset({ ...DEFAULT_VALUES, folders: defaultFolders ?? [] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message ?? 'Failed to create task');
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });
}

export function useCreateTaskForm(defaultFolders?: { id: string; name: string }[]) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createTaskSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTaskSchema as any),
    defaultValues: { ...DEFAULT_VALUES, folders: defaultFolders ?? [] },
  });

  const { mutate: createTask, isPending, isError } = useCreateTask();
  const {
    data: membersData,
    isPending: isMembersPending,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useMembers();
  const {
    data: foldersData,
    isPending: isFoldersPending,
    isLoading: isFoldersLoading,
    isError: isFoldersError,
  } = useFolders();
  const members = membersData?.data ?? [];
  const folders = foldersData?.data?.items ?? [];

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) form.reset({ ...DEFAULT_VALUES, folders: defaultFolders ?? [] });
  }

  function toggleFolder(folderId: string) {
    const current = form.getValues('folders') ?? [];
    const exists = current.some((f) => f.id === folderId);
    if (exists) {
      form.setValue(
        'folders',
        current.filter((f) => f.id !== folderId),
      );
    } else {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        form.setValue('folders', [...current, { id: folder.id, name: folder.name }]);
      }
    }
  }

  return {
    open,
    form,
    members,
    folders,
    isPending,
    handleOpenChange,
    toggleFolder,
    handleSubmit: form.handleSubmit(
      async () =>
        await handleCreateTask({
          form,
          mutate: createTask,
          setOpen,
          defaultFolders,
        }),
      (err) => {
        console.log(err);
      },
    ),
  };
}
