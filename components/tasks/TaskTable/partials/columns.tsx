import Link from "next/link";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { ChevronRightIcon, EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  type TaskPriority,
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

export const columns: ColumnDef<Task, unknown>[] = [
  {
    id: "expand",
    header: "",
    cell: ({ row }) => {
      const hasSubtasks = row.original.subtasks && row.original.subtasks.length > 0;
      if (!hasSubtasks) return null;
      return (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={row.getToggleExpandedHandler()}
        >
          <ChevronRightIcon
            className={cn(
              "size-4 transition-transform",
              row.getIsExpanded() && "rotate-90",
            )}
          />
        </Button>
      );
    },
    size: 32,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/tasks/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <TaskStatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TaskPriority | null;
      if (!priority) return <span className="text-muted-foreground">—</span>;
      return (
        <Badge
          variant="secondary"
          className={cn("text-xs", TASK_PRIORITY_COLORS[priority])}
        >
          {TASK_PRIORITY_LABELS[priority]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignee_name",
    header: "Assignee",
    cell: ({ row }) => {
      const name = row.getValue("assignee_name") as string | null;
      if (!name) return <span className="text-muted-foreground">—</span>;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar size="sm">
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const date = row.getValue("start_date") as string | null;
      return date ? format(new Date(date), "dd/MM/yyyy") : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("due_date") as string | null;
      return date ? format(new Date(date), "dd/MM/yyyy") : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags;
      if (!tags || tags.length === 0)
        return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 justify-end">
        <Button variant="ghost" asChild>
          <Link href={`/tasks/${row.original.id}`}>
            <EyeIcon />
          </Link>
        </Button>
        <DeleteTaskDialog
          taskId={row.original.id}
          taskTitle={row.original.title}
        />
      </div>
    ),
  },
];
