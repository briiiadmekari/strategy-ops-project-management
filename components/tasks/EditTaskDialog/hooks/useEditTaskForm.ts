"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { updateTaskSchema, type UpdateTaskInput } from "@/schema/taskSchema";
import { useUpdateTask } from "@/composables/mutations";
import { useMembers, useFolders } from "@/composables/queries";
import { format } from "date-fns";
import type { Task } from "@/types/task";

export function useEditTaskForm(task: Task) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UpdateTaskInput>(taskToForm(task));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateTask = useUpdateTask();
  const { data: membersData } = useMembers();
  const { data: foldersData } = useFolders();
  const members = membersData?.data ?? [];
  const folders = foldersData?.data?.items ?? [];

  function updateForm(patch: Partial<UpdateTaskInput>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function toggleFolder(folderId: string) {
    setForm((prev) => {
      const current = prev.folders ?? [];
      const exists = current.some((f) => f.id === folderId);
      if (exists) {
        return { ...prev, folders: current.filter((f) => f.id !== folderId) };
      }
      const folder = folders.find((f) => f.id === folderId);
      if (!folder) return prev;
      return {
        ...prev,
        folders: [...current, { id: folder.id, name: folder.name }],
      };
    });
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) {
      setForm(taskToForm(task));
      setErrors({});
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = updateTaskSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key) fieldErrors[String(key)] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    updateTask.mutate(
      { id: task.id, payload: result.data },
      {
        onSuccess: () => {
          toast.success("Task updated");
          setOpen(false);
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(
              err.response?.data?.message ?? "Failed to update task",
            );
          } else {
            toast.error("An unexpected error occurred");
          }
        },
      },
    );
  }

  return {
    open,
    form,
    errors,
    members,
    folders,
    isPending: updateTask.isPending,
    handleOpenChange,
    updateForm,
    toggleFolder,
    handleSubmit,
  };
}

function toDateString(val: string | number | null | undefined): string | undefined {
  if (val == null) return undefined;
  if (typeof val === "number") return format(new Date(val), "yyyy-MM-dd");
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
