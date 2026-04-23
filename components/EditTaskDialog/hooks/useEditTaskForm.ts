'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { z } from 'zod';
import type { UseMutationResult } from '@tanstack/react-query';

import { updateTaskSchema } from '@/schema/taskSchema';
import { useUpdateTask } from '@/composables/mutations';
import { useMembers, useFolders } from '@/composables/queries';
import { format } from 'date-fns';
import type { Task } from '@/types/task';
import type { ApiResponse } from '@/types/api';

type UpdateTaskForm = z.infer<typeof updateTaskSchema>;

interface HandleUpdateTaskParams {
  form: UseFormReturn<UpdateTaskForm>;
  mutate: UseMutationResult<ApiResponse<Task>, Error, { id: string; payload: UpdateTaskForm }, unknown>['mutate'];
  taskId: string;
  setOpen: (open: boolean) => void;
}

async function handleUpdateTask({ form, mutate, taskId, setOpen }: HandleUpdateTaskParams) {
  const data = form.getValues();
  mutate(
    { id: taskId, payload: data },
    {
      onSuccess: () => {
        toast.success('Task updated');
        setOpen(false);
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? 'Failed to update task');
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  );
}

export function useEditTaskForm(task: Task) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof updateTaskSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateTaskSchema as any),
    defaultValues: taskToForm(task),
  });

  const { mutate: updateTask, isPending, isError } = useUpdateTask();
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

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) {
      form.reset(taskToForm(task));
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
        await handleUpdateTask({
          form,
          mutate: updateTask,
          taskId: task.id,
          setOpen,
        }),
      (err) => {
        console.log(err);
      },
    ),
  };
}

function toDateString(val: string | number | null | undefined): string | undefined {
  if (val == null) return undefined;
  if (typeof val === 'number') return format(new Date(val), 'yyyy-MM-dd');
  // Already a string — could be yyyy-MM-dd or ISO
  return val;
}

function taskToForm(task: Task): UpdateTaskInput {
  return {
    title: task.title,
    description: task.description ?? undefined,
    status: task.status,
    priority: task.priority ?? undefined,
    assignee:
      task.assignee_id && task.assignee_name && task.assignee_email
        ? {
            id: task.assignee_id,
            name: task.assignee_name,
            email: task.assignee_email,
          }
        : undefined,
    start_date: toDateString(task.start_date),
    due_date: toDateString(task.due_date),
    tags: task.tags ?? undefined,
    folders: task.folders ?? undefined,
  };
}
