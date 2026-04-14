"use client";

import { CustomTable } from "@/components/CustomTable";
import type { Task } from "@/types/task";
import { columns } from "./partials/columns";

interface TaskTableProps {
  data: Task[];
  isLoading?: boolean;
}

export function TaskTable({ data, isLoading }: TaskTableProps) {
  return (
    <CustomTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No tasks found."
    />
  );
}
