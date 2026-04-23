"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomDialog } from "@/components/CustomDialog";
import { CustomInput, type SelectOption } from "@/components/CustomInput";
import { TASK_STATUSES, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from "@/constant/task";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
} from "@/constant/task";
import type { SubtaskInput } from "@/schema/taskSchema";
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Task, Subtask } from "@/types/task";
import { useSubtasks } from "./hooks/useSubtasks";

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

interface SubtaskSectionProps {
  task: Task;
}

export function SubtaskSection({ task }: SubtaskSectionProps) {
  const {
    subtasks,
    dialogOpen,
    editDialogOpen,
    form,
    errors,
    isPending,
    handleDialogOpenChange,
    handleEditOpen,
    handleEditDialogOpenChange,
    updateForm,
    handleAddSubmit,
    handleEditSubmit,
    handleSubtaskStatusChange,
    handleDelete,
  } = useSubtasks(task);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Subtasks</CardTitle>
          <div className="flex items-center gap-2">
            {subtasks.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {subtasks.length} subtask{subtasks.length !== 1 && "s"}
              </span>
            )}
            <AddSubtaskDialog
              open={dialogOpen}
              onOpenChange={handleDialogOpenChange}
              form={form}
              errors={errors}
              isPending={isPending}
              updateForm={updateForm}
              onSubmit={handleAddSubmit}
            />
            <EditSubtaskDialog
              open={editDialogOpen}
              onOpenChange={handleEditDialogOpenChange}
              form={form}
              errors={errors}
              isPending={isPending}
              updateForm={updateForm}
              onSubmit={handleEditSubmit}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {subtasks.length > 0 ? (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="py-2 px-3 text-left font-medium">Title</th>
                  <th className="py-2 px-3 text-left font-medium">Status</th>
                  <th className="py-2 px-3 text-left font-medium">Priority</th>
                  <th className="py-2 px-3 text-left font-medium">Due Date</th>
                  <th className="py-2 px-3 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {subtasks.map((subtask, index) => (
                  <SubtaskRow
                    key={subtask.id ?? index}
                    subtask={subtask}
                    index={index}
                    isPending={isPending}
                    onStatusChange={handleSubtaskStatusChange}
                    onEdit={handleEditOpen}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              No subtasks yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(value: string | number | null | undefined): string {
  if (value == null) return "—";
  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

interface SubtaskRowProps {
  subtask: Subtask;
  index: number;
  isPending: boolean;
  onStatusChange: (index: number, status: string) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

function SubtaskRow({
  subtask,
  index,
  isPending,
  onStatusChange,
  onEdit,
  onDelete,
}: SubtaskRowProps) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
      {/* Title */}
      <td className="py-2.5 px-3 text-sm font-medium">{subtask.title}</td>
      {/* Status */}
      <td className="py-2.5 px-3">
        <Select
          value={subtask.status}
          onValueChange={(val) => onStatusChange(index, val)}
          disabled={isPending}
        >
          <SelectTrigger className="h-7 w-auto text-xs gap-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                <span
                  className={cn(
                    "inline-block size-2 rounded-full mr-1.5",
                    TASK_STATUS_COLORS[s].split(" ")[0],
                  )}
                />
                {TASK_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      {/* Priority */}
      <td className="py-2.5 px-3">
        {subtask.priority ? (
          <Badge
            variant="secondary"
            className={cn("text-xs", TASK_PRIORITY_COLORS[subtask.priority])}
          >
            {TASK_PRIORITY_LABELS[subtask.priority]}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </td>
      {/* Due Date */}
      <td className="py-2.5 px-3 text-sm text-muted-foreground">
        {formatDate(subtask.due_date)}
      </td>
      {/* Actions */}
      <td className="py-2.5 px-3 text-right">
        <div className="flex items-center gap-0.5 justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(index)}
            disabled={isPending}
            className="text-muted-foreground hover:text-primary"
          >
            <PencilIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(index)}
            disabled={isPending}
            className="text-muted-foreground hover:text-destructive"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface AddSubtaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: SubtaskInput;
  errors: Record<string, string>;
  isPending: boolean;
  updateForm: (patch: Partial<SubtaskInput>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function AddSubtaskDialog({
  open,
  onOpenChange,
  form,
  errors,
  isPending,
  updateForm,
  onSubmit,
}: AddSubtaskDialogProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <Button size="sm" className="bg-primary">
          <PlusIcon />
          Add Subtask
        </Button>
      }
      title="Add Subtask"
      description="Fill in the details for the subtask."
      onSubmit={onSubmit}
      submitLabel="Add"
      isPending={isPending}
      onCancel={() => onOpenChange(false)}
    >
      <CustomInput
        label="Title"
        value={form.title}
        onChange={(e) => updateForm({ title: e.target.value })}
        placeholder="Enter subtask title"
        error={errors.title}
      />

      <CustomInput
        type="textarea"
        label="Description"
        value={form.description ?? ""}
        onChange={(e) => updateForm({ description: e.target.value })}
        placeholder="Enter description (optional)"
      />

      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          type="select"
          label="Status"
          value={form.status}
          onValueChange={(value) =>
            updateForm({ status: value as SubtaskInput["status"] })
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
                  : (value as SubtaskInput["priority"]),
            })
          }
          options={priorityOptions}
          placeholder="None"
        />
      </div>

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
    </CustomDialog>
  );
}

interface EditSubtaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: SubtaskInput;
  errors: Record<string, string>;
  isPending: boolean;
  updateForm: (patch: Partial<SubtaskInput>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function EditSubtaskDialog({
  open,
  onOpenChange,
  form,
  errors,
  isPending,
  updateForm,
  onSubmit,
}: EditSubtaskDialogProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Subtask"
      description="Update the subtask details."
      onSubmit={onSubmit}
      submitLabel="Save"
      isPending={isPending}
      onCancel={() => onOpenChange(false)}
    >
      <CustomInput
        label="Title"
        value={form.title}
        onChange={(e) => updateForm({ title: e.target.value })}
        placeholder="Enter subtask title"
        error={errors.title}
      />

      <CustomInput
        type="textarea"
        label="Description"
        value={form.description ?? ""}
        onChange={(e) => updateForm({ description: e.target.value })}
        placeholder="Enter description (optional)"
      />

      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          type="select"
          label="Status"
          value={form.status}
          onValueChange={(value) =>
            updateForm({ status: value as SubtaskInput["status"] })
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
                  : (value as SubtaskInput["priority"]),
            })
          }
          options={priorityOptions}
          placeholder="None"
        />
      </div>

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
    </CustomDialog>
  );
}
