"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TaskStatusBadge, DeleteTaskDialog } from "@/components/tasks";
import { ArrowLeftIcon, OctagonAlertIcon } from "lucide-react";
import { useTaskDetailPage } from "./hooks/useTaskDetailPage";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { task, isLoading, isError, error } = useTaskDetailPage(id);

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
        <DeleteTaskDialog taskId={task.id} taskTitle={task.title} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <TaskStatusBadge status={task.status} />
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
              <p className="text-sm">{task.assignee_name ?? "Unassigned"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Priority
              </p>
              <p className="text-sm">{task.priority ?? "—"}</p>
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
        </CardContent>
      </Card>
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
