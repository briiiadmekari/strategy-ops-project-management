"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  Hexagon
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, Subtask } from "@/types/task";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_TAG_COLORS,
  type TaskStatus,
  type TaskTag,
  TASK_ICON_COLORS,
  TASK_ICON_BORDER_COLORS,
} from "@/constant/task";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value: string | number | null): string {
  if (!value) return "—";
  try {
    return format(new Date(value), "dd/MM/yyyy");
  } catch {
    return "—";
  }
}

interface GroupedTaskTableProps {
  data: Task[];
  isLoading?: boolean;
}

export function GroupedTaskTable({ data, isLoading }: GroupedTaskTableProps) {
  const grouped = new Map<TaskStatus, Task[]>();
  for (const status of TASK_STATUSES) {
    const tasksForStatus = data.filter((t) => t.status === status);
    if (tasksForStatus.length > 0) {
      grouped.set(status, tasksForStatus);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
        No tasks found.
      </div>
    );
  }

  return (
    <div className="rounded-md">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="border-b text-xs text-muted-foreground">
            <th className="w-8 px-2" />
            <th className="py-2 px-4 text-left font-medium">Title</th>
            <th className="py-2 px-3 text-left font-medium">Priority</th>
            <th className="py-2 px-3 text-left font-medium">Assignee</th>
            <th className="py-2 px-3 text-left font-medium">Start Date</th>
            <th className="py-2 px-3 text-left font-medium">Due Date</th>
            <th className="py-2 px-3 text-left font-medium">Tags</th>
            <th className="py-2 px-3 text-left font-medium">Created At</th>
            <th className="py-2 px-3 text-right font-medium" />
          </tr>
        </thead>
        <tbody>
          {Array.from(grouped.entries()).map(([status, tasks]) => (
            <StatusGroup key={status} status={status} tasks={tasks} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusGroup({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <tr
        className=" hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <td colSpan={9} className="px-4 py-2.5">
          <div className="flex items-center gap-3">
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform",
                !expanded && "-rotate-90",
              )}
            />
            <Badge
              variant="secondary"
              className={cn("text-xs", TASK_STATUS_COLORS[status])}
            >
              {TASK_STATUS_LABELS[status]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {tasks.length} task{tasks.length !== 1 && "s"}
            </span>
          </div>
        </td>
      </tr>
      {expanded &&
        tasks.map((task) => <TaskRow key={task.id} task={task} status={status} />)}
    </>
  );
}

function TaskRow({ task, status }: { task: Task; status: TaskStatus }) {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const [subtasksExpanded, setSubtasksExpanded] = useState(false);

  return (
    <>
      <tr className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
        {/* Expand subtasks */}
        <td className="px-2">
          {hasSubtasks ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSubtasksExpanded((prev) => !prev)}
            >
              <ChevronRightIcon
                className={cn(
                  "size-4 transition-transform",
                  subtasksExpanded && "rotate-90",
                )}
              />
            </Button>
          ) : null}
        </td>
        {/* Title */}
        <td className="flex items-center gap-2 py-2.5 px-4 text-sm">
          <div className="relative inline-block">
            <Hexagon className={cn("size-6", TASK_ICON_BORDER_COLORS[status])} />
            <Hexagon 
              className={cn(
                "size-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", 
                TASK_ICON_COLORS[status]
              )} 
            />
          </div>
          <Link
            href={`/tasks/${task.id}`}
            className="font-medium hover:underline"
          >
            {task.title}
          </Link>
        </td>
        {/* Priority */}
        <td className="py-2.5 px-3">
          {task.priority ? (
            <Badge
              variant="secondary"
              className={cn("text-xs", TASK_PRIORITY_COLORS[task.priority])}
            >
              {TASK_PRIORITY_LABELS[task.priority]}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </td>
        {/* Assignee */}
        <td className="py-2.5 px-3">
          {task.assignee_name ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar size="sm">
                  <AvatarFallback>{getInitials(task.assignee_name)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{task.assignee_name}</TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </td>
        {/* Start Date */}
        <td className="py-2.5 px-3 text-sm text-muted-foreground">
          {formatDate(task.start_date)}
        </td>
        {/* Due Date */}
        <td className="py-2.5 px-3 text-sm text-muted-foreground">
          {formatDate(task.due_date)}
        </td>
        {/* Tags */}
        <td className="py-2.5 px-3">
          {task.tags && task.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    "text-xs capitalize",
                    TASK_TAG_COLORS[tag as TaskTag] ?? "bg-zinc-100 text-zinc-600",
                  )}
                >
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </td>
        {/* Created At */}
        <td className="py-2.5 px-3 text-sm text-muted-foreground">
          {formatDate(task.created_at)}
        </td>
        {/* Actions */}
        <td className="py-2.5 px-3 text-right">
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href={`/tasks/${task.id}`}>
                <EyeIcon className="size-4" />
              </Link>
            </Button>
            <DeleteTaskDialog taskId={task.id} taskTitle={task.title} />
          </div>
        </td>
      </tr>
      {/* Subtask rows */}
      {subtasksExpanded &&
        task.subtasks?.map((subtask, i) => (
          <SubtaskRow key={subtask.id ?? `sub-${i}`} subtask={subtask} />
        ))}
    </>
  );
}

function SubtaskRow({ subtask }: { subtask: Subtask }) {
  return (
    <tr className="border-b last:border-b-0 bg-muted/30 hover:bg-muted/40 transition-colors">
      {/* expand col — empty */}
      <td />
      {/* title — indented */}
      <td className="flex items-center gap-2 py-2 px-4 pl-10 ">
        <Hexagon className={cn("size-3", TASK_ICON_COLORS[subtask.status])} />
        <span className="text-sm text-muted-foreground">
          {subtask.title}
        </span>
      </td>
      {/* priority */}
      <td className="py-2 px-3">
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
      {/* remaining cols empty */}
      <td />
      
      <td />
      <td />
      <td />
    </tr>
  );
}
