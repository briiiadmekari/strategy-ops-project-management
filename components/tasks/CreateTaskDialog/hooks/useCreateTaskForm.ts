"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { createTaskSchema, type CreateTaskInput } from "@/schema/taskSchema";
import { useCreateTask } from "@/composables/mutations";
import { useMembers } from "@/composables/queries";

const INITIAL_FORM: CreateTaskInput = {
  title: "",
  description: "",
  status: "BACKLOG",
  priority: undefined,
  assignee: undefined,
  start_date: undefined,
  due_date: undefined,
  tags: [],
};

export function useCreateTaskForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateTaskInput>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createTask = useCreateTask();
  const { data: membersData } = useMembers();
  const members = membersData?.data ?? [];

  function resetForm() {
    setForm({ ...INITIAL_FORM });
    setErrors({});
  }

  function updateForm(patch: Partial<CreateTaskInput>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) resetForm();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = createTaskSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key) fieldErrors[String(key)] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    createTask.mutate(result.data, {
      onSuccess: () => {
        toast.success("Task created");
        setOpen(false);
        resetForm();
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message ?? "Failed to create task",
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      },
    });
  }

  return {
    open,
    form,
    errors,
    members,
    isPending: createTask.isPending,
    handleOpenChange,
    updateForm,
    handleSubmit,
  };
}
