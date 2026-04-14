import Link from "next/link";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { EyeIcon } from "lucide-react";
import type { Task } from "@/types/task";

export const columns: ColumnDef<Task, unknown>[] = [
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
    accessorKey: "assignee_name",
    header: "Assignee",
    cell: ({ row }) => row.getValue("assignee_name") ?? "—",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("due_date") as string | null;
      return date ? format(new Date(date), "dd/MM/yyyy") : "—";
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) =>
      format(new Date(row.getValue("created_at") as string), "dd/MM/yyyy"),
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
