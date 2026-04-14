"use client";

import { Button } from "@/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { CustomDialog } from "@/components/CustomDialog";
import { CustomInput, type SelectOption } from "@/components/CustomInput";
import { TASK_STATUSES, TASK_STATUS_LABELS } from "@/constant/task";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
} from "@/constant/task";
import type { UpdateTaskInput } from "@/schema/taskSchema";
import type { Task } from "@/types/task";
import { useEditTaskForm } from "./hooks/useEditTaskForm";
import { cn } from "@/lib/utils";

const statusOptions: SelectOption[] = TASK_STATUSES.map((s) => ({
  value: s,
  label: TASK_STATUS_LABELS[s],
}));

const priorityOptions: SelectOption[] = [
  { value: "none", label: "None" },
  ...TASK_PRIORITIES.map((p) => ({
    value: p,
    label: TASK_PRIORITY_LABELS[p],
    icon: (
      <span className={cn("size-2 rounded-full", TASK_PRIORITY_COLORS[p])} />
    ),
  })),
];

interface EditTaskDialogProps {
  task: Task;
}

export function EditTaskDialog({ task }: EditTaskDialogProps) {
  const {
    open,
    form,
    errors,
    members,
    folders,
    isPending,
    handleOpenChange,
    updateForm,
    toggleFolder,
    handleSubmit,
  } = useEditTaskForm(task);

  const assigneeOptions: SelectOption[] = [
    { value: "unassigned", label: "Unassigned" },
    ...members.map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <CustomDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button variant="outline" size="sm">
          <PencilIcon />
          Edit
        </Button>
      }
      title="Edit Task"
      description="Update the task details."
      onSubmit={handleSubmit}
      submitLabel="Save"
      isPending={isPending}
      onCancel={() => handleOpenChange(false)}
    >
      {/* Title */}
      <CustomInput
        label="Title"
        value={form.title ?? ""}
        onChange={(e) => updateForm({ title: e.target.value })}
        placeholder="Enter task title"
        error={errors.title}
      />

      {/* Description */}
      <CustomInput
        type="textarea"
        label="Description"
        value={form.description ?? ""}
        onChange={(e) => updateForm({ description: e.target.value })}
        placeholder="Enter task description (optional)"
      />

      {/* Status & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          type="select"
          label="Status"
          value={form.status}
          onValueChange={(value) =>
            updateForm({ status: value as UpdateTaskInput["status"] })
          }
          options={statusOptions}
        />

        <CustomInput
          type="select"
          label="Priority"
          value={form.priority ?? "none"}
          onValueChange={(value) =>
            updateForm({
              priority:
                value === "none"
                  ? undefined
                  : (value as UpdateTaskInput["priority"]),
            })
          }
          options={priorityOptions}
          placeholder="None"
        />
      </div>

      {/* Assignee */}
      <CustomInput
        type="select"
        label="Assignee"
        value={form.assignee?.id ?? "unassigned"}
        onValueChange={(value) => {
          if (value === "unassigned") {
            updateForm({ assignee: undefined });
          } else {
            const member = members.find((m) => m.id === value);
            if (member) {
              updateForm({
                assignee: {
                  id: member.id,
                  name: member.name,
                  email: member.email,
                },
              });
            }
          }
        }}
        options={assigneeOptions}
        placeholder="Unassigned"
        error={errors.assignee}
      />

      {/* Start Date & Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          type="date"
          label="Start Date"
          value={form.start_date}
          onDateChange={(val) => updateForm({ start_date: val })}
        />
        <CustomInput
          type="date"
          label="Due Date"
          value={form.due_date}
          onDateChange={(val) => updateForm({ due_date: val })}
        />
      </div>

      {/* Tags */}
      <CustomInput
        type="tags"
        label="Tags"
        value={form.tags ?? []}
        onTagsChange={(tags) => updateForm({ tags })}
        placeholder="Type a tag and press Enter"
      />

      {/* Folders */}
      {folders.length > 0 && (
        <div className="space-y-2">
          <Label>Folders</Label>
          {form.folders && form.folders.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.folders.map((f) => (
                <Badge key={f.id} variant="secondary" className="gap-1">
                  {f.name}
                  <button
                    type="button"
                    onClick={() => toggleFolder(f.id)}
                    className="ml-0.5 hover:text-destructive"
                  >
                    <XIcon className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className="max-h-32 overflow-y-auto space-y-1 rounded-md border p-2">
            {folders.map((folder) => (
              <label
                key={folder.id}
                className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
              >
                <Checkbox
                  checked={(form.folders ?? []).some((f) => f.id === folder.id)}
                  onCheckedChange={() => toggleFolder(folder.id)}
                />
                <span>{folder.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </CustomDialog>
  );
}
