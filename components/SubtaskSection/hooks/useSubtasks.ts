'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { z } from 'zod';
import type { UseMutationResult } from '@tanstack/react-query';

import { subtaskSchema, updateTaskSchema } from '@/schema/taskSchema';
import { useUpdateTask } from '@/composables/mutations';
import type { Task, Subtask } from '@/types/task';
import type { ApiResponse } from '@/types/api';

type SubtaskForm = z.infer<typeof subtaskSchema>;
type UpdateTaskForm = z.infer<typeof updateTaskSchema>;
type UpdateTaskMutation = UseMutationResult<ApiResponse<Task>, Error, { id: string; payload: UpdateTaskForm }, unknown>;

function subtaskToInput(st: Subtask): SubtaskForm {
  return {
    id: st.id,
    title: st.title,
    description: st.description ?? undefined,
    status: st.status,
    priority: st.priority ?? undefined,
    start_date: st.start_date != null ? String(st.start_date) : undefined,
    due_date: st.due_date != null ? String(st.due_date) : undefined,
    is_completed: st.is_completed,
  };
}

const DEFAULT_VALUES: SubtaskForm = {
  title: '',
  description: '',
  status: 'BACKLOG',
  priority: undefined,
  start_date: undefined,
  due_date: undefined,
  is_completed: false,
};

// --- External handler functions ---

interface HandleAddSubtaskParams {
  form: UseFormReturn<SubtaskForm>;
  mutate: UpdateTaskMutation['mutate'];
  taskId: string;
  subtasks: Subtask[];
  setDialogOpen: (open: boolean) => void;
}

async function handleAddSubtask({ form, mutate, taskId, subtasks, setDialogOpen }: HandleAddSubtaskParams) {
  const data = form.getValues();
  mutate(
    {
      id: taskId,
      payload: { subtasks: [...subtasks.map(subtaskToInput), data] },
    },
    {
      onSuccess: () => {
        toast.success('Subtask added');
        setDialogOpen(false);
        form.reset({ ...DEFAULT_VALUES });
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? 'Failed to add subtask');
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  );
}

interface HandleEditSubtaskParams {
  form: UseFormReturn<SubtaskForm>;
  mutate: UpdateTaskMutation['mutate'];
  taskId: string;
  subtasks: Subtask[];
  editIndex: number | null;
  setEditDialogOpen: (open: boolean) => void;
  setEditIndex: (index: number | null) => void;
}

async function handleEditSubtask({
  form,
  mutate,
  taskId,
  subtasks,
  editIndex,
  setEditDialogOpen,
  setEditIndex,
}: HandleEditSubtaskParams) {
  if (editIndex === null) return;
  const data = form.getValues();

  const updated = subtasks.map((st, i) => (i === editIndex ? { ...st, ...data } : st));

  mutate(
    { id: taskId, payload: { subtasks: updated.map(subtaskToInput) } },
    {
      onSuccess: () => {
        toast.success('Subtask updated');
        setEditDialogOpen(false);
        setEditIndex(null);
        form.reset({ ...DEFAULT_VALUES });
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? 'Failed to update subtask');
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  );
}

interface HandleSubtaskStatusChangeParams {
  mutate: UpdateTaskMutation['mutate'];
  taskId: string;
  subtasks: Subtask[];
  index: number;
  newStatus: string;
}

function handleSubtaskStatusChange({ mutate, taskId, subtasks, index, newStatus }: HandleSubtaskStatusChangeParams) {
  const updated = subtasks.map((st, i) =>
    i === index ? { ...st, status: newStatus as Subtask['status'], is_completed: newStatus === 'COMPLETED' } : st,
  );

  mutate(
    { id: taskId, payload: { subtasks: updated.map(subtaskToInput) } },
    {
      onSuccess: () => {
        toast.success('Subtask status updated');
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? 'Failed to update subtask');
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  );
}

interface HandleDeleteSubtaskParams {
  mutate: UpdateTaskMutation['mutate'];
  taskId: string;
  subtasks: Subtask[];
  index: number;
}

function handleDeleteSubtask({ mutate, taskId, subtasks, index }: HandleDeleteSubtaskParams) {
  const updated = subtasks.filter((_, i) => i !== index);

  mutate(
    { id: taskId, payload: { subtasks: updated.map(subtaskToInput) } },
    {
      onSuccess: () => {
        toast.success('Subtask removed');
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? 'Failed to remove subtask');
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  );
}

// --- Hook ---

export function useSubtasks(task: Task) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addForm = useForm<z.infer<typeof subtaskSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(subtaskSchema as any),
    defaultValues: { ...DEFAULT_VALUES },
  });

  const editForm = useForm<z.infer<typeof subtaskSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(subtaskSchema as any),
    defaultValues: { ...DEFAULT_VALUES },
  });

  const { mutate: updateTask, isPending, isError } = useUpdateTask();

  const subtasks = task.subtasks ?? [];

  function handleDialogOpenChange(value: boolean) {
    setDialogOpen(value);
    if (!value) addForm.reset({ ...DEFAULT_VALUES });
  }

  function handleEditOpen(index: number) {
    const subtask = subtasks[index];
    setEditIndex(index);
    editForm.reset(subtaskToInput(subtask));
    setEditDialogOpen(true);
  }

  function handleEditDialogOpenChange(value: boolean) {
    setEditDialogOpen(value);
    if (!value) {
      setEditIndex(null);
      editForm.reset({ ...DEFAULT_VALUES });
    }
  }

  return {
    subtasks,
    dialogOpen,
    editDialogOpen,
    addForm,
    editForm,
    isPending,
    handleDialogOpenChange,
    handleEditOpen,
    handleEditDialogOpenChange,
    handleAddSubmit: addForm.handleSubmit(
      async () =>
        await handleAddSubtask({
          form: addForm,
          mutate: updateTask,
          taskId: task.id,
          subtasks,
          setDialogOpen,
        }),
      (err) => {
        console.log(err);
      },
    ),
    handleEditSubmit: editForm.handleSubmit(
      async () =>
        await handleEditSubtask({
          form: editForm,
          mutate: updateTask,
          taskId: task.id,
          subtasks,
          editIndex,
          setEditDialogOpen,
          setEditIndex,
        }),
      (err) => {
        console.log(err);
      },
    ),
    handleSubtaskStatusChange: (index: number, newStatus: string) =>
      handleSubtaskStatusChange({
        mutate: updateTask,
        taskId: task.id,
        subtasks,
        index,
        newStatus,
      }),
    handleDelete: (index: number) =>
      handleDeleteSubtask({
        mutate: updateTask,
        taskId: task.id,
        subtasks,
        index,
      }),
  };
}
