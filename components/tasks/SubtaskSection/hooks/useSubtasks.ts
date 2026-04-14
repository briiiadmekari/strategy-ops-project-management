"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { subtaskSchema, type SubtaskInput } from "@/schema/taskSchema";
import { useUpdateTask } from "@/composables/mutations";
import type { Task, Subtask } from "@/types/task";

function subtaskToInput(st: Subtask): SubtaskInput {
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

const INITIAL_FORM: SubtaskInput = {
  title: "",
  description: "",
  status: "BACKLOG",
  priority: undefined,
  start_date: undefined,
  due_date: undefined,
  is_completed: false,
};

export function useSubtasks(task: Task) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<SubtaskInput>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateTask = useUpdateTask();

  const subtasks = task.subtasks ?? [];

  function resetForm() {
    setForm({ ...INITIAL_FORM });
    setErrors({});
  }

  function updateForm(patch: Partial<SubtaskInput>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleDialogOpenChange(value: boolean) {
    setDialogOpen(value);
    if (!value) resetForm();
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = subtaskSchema.safeParse(form);
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
      {
        id: task.id,
        payload: { subtasks: [...subtasks.map(subtaskToInput), result.data] },
      },
      {
        onSuccess: () => {
          toast.success("Subtask added");
          setDialogOpen(false);
          resetForm();
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(
              err.response?.data?.message ?? "Failed to add subtask",
            );
          } else {
            toast.error("An unexpected error occurred");
          }
        },
      },
    );
  }

  function handleSubtaskStatusChange(index: number, newStatus: string) {
    const updated = subtasks.map((st, i) =>
      i === index
        ? { ...st, status: newStatus as Subtask["status"], is_completed: newStatus === "COMPLETED" }
        : st,
    );

    updateTask.mutate(
      { id: task.id, payload: { subtasks: updated.map(subtaskToInput) } },
      {
        onSuccess: () => {
          toast.success("Subtask status updated");
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(
              err.response?.data?.message ?? "Failed to update subtask",
            );
          } else {
            toast.error("An unexpected error occurred");
          }
        },
      },
    );
  }

  function handleDelete(index: number) {
    const updated = subtasks.filter((_, i) => i !== index);

    updateTask.mutate(
      { id: task.id, payload: { subtasks: updated.map(subtaskToInput) } },
      {
        onSuccess: () => {
          toast.success("Subtask removed");
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(
              err.response?.data?.message ?? "Failed to remove subtask",
            );
          } else {
            toast.error("An unexpected error occurred");
          }
        },
      },
    );
  }

  return {
    subtasks,
    dialogOpen,
    form,
    errors,
    isPending: updateTask.isPending,
    handleDialogOpenChange,
    updateForm,
    handleAddSubmit,
    handleSubtaskStatusChange,
    handleDelete,
  };
}
