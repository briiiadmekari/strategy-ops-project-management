"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { format, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";
import { PlusIcon, CalendarIcon } from "lucide-react";

import { TASK_STATUSES, TASK_STATUS_LABELS } from "@/constant/task";
import { createTaskSchema, type CreateTaskInput } from "@/schema/taskSchema";
import { useCreateTask } from "@/composables/mutations";
import { useMembers } from "@/composables/queries";
import { cn } from "@/lib/utils";

function DatePickerField({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (val: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date())
    : undefined;

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label>Due Date</Label>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <CalendarIcon className="size-4" />
        {value ? format(selectedDate!, "dd/MM/yyyy") : "Pick a date"}
      </Button>
      {open && (
        <div className="absolute z-50 mt-1 rounded-md border bg-popover shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onChange(date ? format(date, "yyyy-MM-dd") : undefined);
              setOpen(false);
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  );
}

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateTaskInput>({
    title: "",
    description: "",
    status: "BACKLOG",
    assignee: undefined,
    due_date: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createTask = useCreateTask();
  const { data: membersData } = useMembers();
  const members = membersData?.data ?? [];

  function resetForm() {
    setForm({
      title: "",
      description: "",
      status: "BACKLOG",
      assignee: undefined,
      due_date: undefined,
    });
    setErrors({});
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

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter task title"
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Enter task description (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    status: value as CreateTaskInput["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {TASK_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={form.assignee?.id ?? "unassigned"}
                onValueChange={(value) => {
                  if (value === "unassigned") {
                    setForm({ ...form, assignee: undefined });
                  } else {
                    const member = members.find((m) => m.id === value);
                    if (member) {
                      setForm({
                        ...form,
                        assignee: {
                          id: member.id,
                          name: member.name,
                          email: member.email,
                        },
                      });
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignee && (
                <p className="text-xs text-destructive">{errors.assignee}</p>
              )}
            </div>
          </div>

          <DatePickerField
            value={form.due_date}
            onChange={(val) => setForm({ ...form, due_date: val })}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending ? <Spinner className="size-4" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
