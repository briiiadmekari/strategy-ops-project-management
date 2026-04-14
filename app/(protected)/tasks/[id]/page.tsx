"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeleteTaskDialog, EditTaskDialog, SubtaskSection } from "@/components/tasks";
import { ArrowLeftIcon, OctagonAlertIcon } from "lucide-react";
import { useTaskDetailPage } from "./hooks/useTaskDetailPage";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
} from "@/constant/task";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { task, isLoading, isError, error, isUpdating, handleStatusChange } = useTaskDetailPage(id);

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-tasks">
            <ArrowLeftIcon />
            Back to tasks
          </Link>
        </Button>
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertDescription>
            {error?.message ?? "Failed to load task."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-tasks">
            <ArrowLeftIcon />
            Back to tasks
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Task not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-tasks">
            <ArrowLeftIcon />
            Back to tasks
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <EditTaskDialog task={task} />
          <DeleteTaskDialog taskId={task.id} taskTitle={task.title} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <Select
              value={task.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className={cn("h-8 w-auto text-xs gap-1 font-medium", TASK_STATUS_COLORS[task.status])}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className={cn("inline-block size-2 rounded-full mr-1.5", TASK_STATUS_COLORS[s].split(" ")[0])} />
                    {TASK_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {task.description && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="text-sm whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Assignee
              </p>
              {task.assignee_name ? (
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>
                      {getInitials(task.assignee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{task.assignee_name}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Unassigned</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Priority
              </p>
              {task.priority ? (
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    TASK_PRIORITY_COLORS[task.priority],
                  )}
                >
                  {TASK_PRIORITY_LABELS[task.priority]}
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Start Date
              </p>
              <p className="text-sm">
                {task.start_date
                  ? format(new Date(task.start_date), "MMM d, yyyy")
                  : "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Due Date
              </p>
              <p className="text-sm">
                {task.due_date
                  ? format(new Date(task.due_date), "MMM d, yyyy")
                  : "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Created
              </p>
              <p className="text-sm">
                {format(new Date(task.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-6 sm:grid-cols-12">
            {task.tags && task.tags.length > 0 && (
              <div className="space-y-2 col-span-2 sm:col-span-4">
                <p className="text-sm font-medium text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {task.folders && task.folders.length > 0 && (
              <div className="space-y-2 col-span-2 sm:col-span-4">
                <p className="text-sm font-medium text-muted-foreground">Folders</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.folders.map((f) => (
                    <Badge key={f.id} variant="outline">
                      {f.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SubtaskSection task={task} />
    </div>
  );
}

function TaskDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-32" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
