"use client";

import { useState } from "react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskLog } from "@/types/task-log";
import type { Subtask } from "@/types/task";
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_TAG_COLORS,
  type TaskTag,
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

interface LogsTableProps {
  logs: TaskLog[];
  isLoading: boolean;
}

export function LogsTable({ logs, isLoading }: LogsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
        No logs found.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="border-b text-xs text-muted-foreground">
            <th className="w-8 px-2" />
            <th className="py-2 px-4 text-left font-medium">Title</th>
            <th className="py-2 px-3 text-left font-medium">Priority</th>
            <th className="py-2 px-3 text-left font-medium">Assignee</th>
            <th className="py-2 px-3 text-left font-medium">Due Date</th>
            <th className="py-2 px-3 text-left font-medium">Completed</th>
            <th className="py-2 px-3 text-left font-medium">Tags</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogRow({ log }: { log: TaskLog }) {
  const hasSubtasks = log.subtasks && log.subtasks.length > 0;
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
        {/* Expand subtasks */}
        <td className="px-2">
          {hasSubtasks ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setExpanded((prev) => !prev)}
            >
              <ChevronRightIcon
                className={cn(
                  "size-4 transition-transform",
                  expanded && "rotate-90",
                )}
              />
            </Button>
          ) : null}
        </td>
        {/* Title */}
        <td className="py-2.5 px-4 text-sm font-medium">{log.title}</td>
        {/* Priority */}
        <td className="py-2.5 px-3">
          {log.priority ? (
            <Badge
              variant="secondary"
              className={cn("text-xs", TASK_PRIORITY_COLORS[log.priority])}
            >
              {TASK_PRIORITY_LABELS[log.priority]}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </td>
        {/* Assignee */}
        <td className="py-2.5 px-3">
          {log.assignee_name ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar size="sm">
                  <AvatarFallback>
                    {getInitials(log.assignee_name)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{log.assignee_name}</TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </td>
        {/* Due Date */}
        <td className="py-2.5 px-3 text-sm text-muted-foreground">
          {formatDate(log.due_date)}
        </td>
        {/* Completed */}
        <td className="py-2.5 px-3 text-sm text-muted-foreground">
          {formatDate(log.completed_at)}
        </td>
        {/* Tags */}
        <td className="py-2.5 px-3">
          {log.tags && log.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {log.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    "text-xs capitalize",
                    TASK_TAG_COLORS[tag as TaskTag] ??
                      "bg-zinc-100 text-zinc-600",
                  )}
                >
                  {tag}
                </Badge>
              ))}
              {log.tags.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  +{log.tags.length - 2}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </td>
      </tr>
      {/* Subtask rows */}
      {expanded &&
        log.subtasks?.map((subtask, i) => (
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
      <td className="py-2 px-4 pl-10 text-sm text-muted-foreground">
        {subtask.title}
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
      {/* assignee — empty */}
      <td />
      {/* due date */}
      <td className="py-2 px-3 text-sm text-muted-foreground">
        {formatDate(subtask.due_date ?? null)}
      </td>
      {/* completed — empty */}
      <td />
      {/* tags — empty */}
      <td />
    </tr>
  );
}
