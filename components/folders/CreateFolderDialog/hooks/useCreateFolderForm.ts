"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { createFolderSchema, type CreateFolderInput } from "@/schema/folderSchema";
import { useCreateFolder } from "@/composables/mutations";
import { useMembers } from "@/composables/queries";

const INITIAL_FORM: CreateFolderInput = {
  name: "",
  members: [],
};

export function useCreateFolderForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateFolderInput>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createFolder = useCreateFolder();
  const { data: membersData } = useMembers();
  const members = membersData?.data ?? [];

  function resetForm() {
    setForm({ ...INITIAL_FORM, members: [] });
    setErrors({});
  }

  function updateForm(patch: Partial<CreateFolderInput>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function toggleMember(memberId: string) {
    setForm((prev) => {
      const current = prev.members ?? [];
      const exists = current.some((m) => m.id === memberId);
      if (exists) {
        return { ...prev, members: current.filter((m) => m.id !== memberId) };
      }
      const member = members.find((m) => m.id === memberId);
      if (!member) return prev;
      return {
        ...prev,
        members: [...current, { id: member.id, name: member.name, email: member.email }],
      };
    });
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) resetForm();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = createFolderSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key) fieldErrors[String(key)] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    createFolder.mutate(result.data, {
      onSuccess: () => {
        toast.success("Folder created");
        setOpen(false);
        resetForm();
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? "Failed to create folder");
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
    isPending: createFolder.isPending,
    handleOpenChange,
    updateForm,
    toggleMember,
    handleSubmit,
  };
}
