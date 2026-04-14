"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CustomDialog } from "@/components/CustomDialog";
import { CustomInput } from "@/components/CustomInput";
import { useCreateFolderForm } from "./hooks/useCreateFolderForm";

export function CreateFolderDialog() {
  const {
    open,
    form,
    errors,
    members,
    isPending,
    handleOpenChange,
    updateForm,
    toggleMember,
    handleSubmit,
  } = useCreateFolderForm();

  const selectedIds = new Set((form.members ?? []).map((m) => m.id));

  return (
    <CustomDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button variant="ghost" size="icon-sm">
          <PlusIcon className="size-4" />
        </Button>
      }
      title="Create Folder"
      description="Create a new folder and choose members who can see it."
      onSubmit={handleSubmit}
      submitLabel="Create"
      isPending={isPending}
      onCancel={() => handleOpenChange(false)}
    >
      <CustomInput
        label="Folder Name"
        value={form.name}
        onChange={(e) => updateForm({ name: e.target.value })}
        placeholder="Enter folder name"
        error={errors.name}
      />

      <div className="space-y-2">
        <Label>Members</Label>
        {form.members && form.members.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.members.map((m) => (
              <Badge key={m.id} variant="secondary" className="gap-1">
                {m.name}
                <button
                  type="button"
                  onClick={() => toggleMember(m.id)}
                  className="ml-0.5 hover:text-destructive"
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <div className="max-h-40 overflow-y-auto space-y-1 rounded-md border p-2">
          {members.length > 0 ? (
            members.map((member) => (
              <label
                key={member.id}
                className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
              >
                <Checkbox
                  checked={selectedIds.has(member.id)}
                  onCheckedChange={() => toggleMember(member.id)}
                />
                <span>{member.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {member.email}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No members available
            </p>
          )}
        </div>
      </div>
    </CustomDialog>
  );
}
