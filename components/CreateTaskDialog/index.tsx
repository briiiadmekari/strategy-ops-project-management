'use client';

import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusIcon, XIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { CustomDialog } from '@/components/CustomDialog';
import { CustomInput, type SelectOption } from '@/components/CustomInput';
import { RichTextEditor } from '@/components/RichTextEditor';
import { TASK_STATUSES, TASK_STATUS_LABELS } from '@/constant/task';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_TAGS,
  TASK_TAG_COLORS,
} from '@/constant/task';
import { z } from 'zod';
import { createTaskSchema } from '@/schema/taskSchema';
import { useCreateTaskForm } from './hooks/useCreateTaskForm';
import { cn } from '@/lib/utils';

const statusOptions: SelectOption[] = TASK_STATUSES.map((s) => ({
  value: s,
  label: TASK_STATUS_LABELS[s],
}));

const priorityOptions: SelectOption[] = [
  { value: 'none', label: 'None' },
  ...TASK_PRIORITIES.map((p) => ({
    value: p,
    label: TASK_PRIORITY_LABELS[p],
    icon: <span className={cn('size-2 rounded-full', TASK_PRIORITY_COLORS[p])} />,
  })),
];

export function CreateTaskDialog({
  defaultFolders,
}: {
  defaultFolders?: { id: string; name: string }[];
} = {}) {
  const { open, form, members, folders, isPending, handleOpenChange, toggleFolder, handleSubmit } =
    useCreateTaskForm(defaultFolders);

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const watchedFolders = watch('folders') ?? [];
  const watchedTags = watch('tags') ?? [];

  const assigneeOptions: SelectOption[] = [...members.map((m) => ({ value: m.id, label: m.name }))];

  return (
    <CustomDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button size="sm">
          <PlusIcon />
          Create Task
        </Button>
      }
      title="Create Task"
      description="Fill in the details to create a new task."
      onSubmit={handleSubmit}
      submitLabel="Create"
      isPending={isPending}
      onCancel={() => handleOpenChange(false)}
    >
      {/* Title */}
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <CustomInput
            label="Title"
            value={field.value}
            onChange={field.onChange}
            placeholder="Enter task title"
            error={errors.title?.message}
          />
        )}
      />

      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <RichTextEditor
            label="Description"
            value={field.value ?? ''}
            onChange={field.onChange}
            placeholder="Enter task description (optional)"
          />
        )}
      />

      {/* Status & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <CustomInput
              type="select"
              label="Status"
              value={field.value}
              onValueChange={(value) => field.onChange(value as z.infer<typeof createTaskSchema>['status'])}
              options={statusOptions}
            />
          )}
        />

        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <CustomInput
              type="select"
              label="Priority"
              value={field.value ?? 'none'}
              onValueChange={(value) =>
                field.onChange(value === 'none' ? undefined : (value as z.infer<typeof createTaskSchema>['priority']))
              }
              options={priorityOptions}
              placeholder="None"
            />
          )}
        />
      </div>

      {/* Assignee */}
      <Controller
        control={control}
        name="assignee"
        render={({ field }) => (
          <CustomInput
            type="select"
            label="Assignee"
            value={field.value?.id ?? ''}
            onValueChange={(value) => {
              const member = members.find((m) => m.id === value);
              if (member) {
                field.onChange({ id: member.id, name: member.name, email: member.email });
              }
            }}
            options={assigneeOptions}
            placeholder="Select assignee"
            error={errors.assignee?.id?.message}
          />
        )}
      />

      {/* Start Date & Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="start_date"
          render={({ field }) => (
            <CustomInput type="date" label="Start Date" value={field.value} onDateChange={field.onChange} />
          )}
        />
        <Controller
          control={control}
          name="due_date"
          render={({ field }) => (
            <CustomInput type="date" label="Due Date" value={field.value} onDateChange={field.onChange} />
          )}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-1.5">
          {TASK_TAGS.map((tag) => {
            const isSelected = watchedTags.includes(tag);
            return (
              <Badge
                key={tag}
                variant={isSelected ? 'default' : 'outline'}
                className={cn('cursor-pointer capitalize', isSelected && TASK_TAG_COLORS[tag])}
                onClick={() => {
                  setValue('tags', isSelected ? watchedTags.filter((t) => t !== tag) : [...watchedTags, tag]);
                }}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="space-y-2">
          <Label>Folders</Label>
          {watchedFolders.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {watchedFolders.map((f) => (
                <Badge key={f.id} variant="secondary" className="gap-1">
                  {f.name}
                  <button type="button" onClick={() => toggleFolder(f.id)} className="ml-0.5 hover:text-destructive">
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
                className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-sidebar cursor-pointer"
              >
                <Checkbox
                  checked={watchedFolders.some((f) => f.id === folder.id)}
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
