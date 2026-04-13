import { useState } from "react";
import { useMyTasks } from "@/composables/queries";
import type { TaskStatus } from "@/constant/task";

export function useMyTasksPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [assigneeId, setAssigneeId] = useState<string | undefined>();
  const [sortByDueDate, setSortByDueDate] = useState<
    "asc" | "desc" | undefined
  >();

  const tasksQuery = useMyTasks({
    page,
    limit,
    status,
    assignee_id: assigneeId,
    sort_by_due_date: sortByDueDate,
  });

  const tasks = tasksQuery.data?.data?.items ?? [];
  const totalPages = tasksQuery.data?.data?.total_pages ?? 1;

  function handleStatusChange(value: TaskStatus | undefined) {
    setStatus(value);
    setPage(1);
  }

  function handleAssigneeChange(value: string | undefined) {
    setAssigneeId(value);
    setPage(1);
  }

  function handleSortByDueDateChange(value: "asc" | "desc" | undefined) {
    setSortByDueDate(value);
    setPage(1);
  }

  return {
    // Data
    tasks,
    totalPages,

    // Pagination
    page,
    limit,
    setPage,
    setLimit,

    // Filters
    status,
    assigneeId,
    sortByDueDate,
    handleStatusChange,
    handleAssigneeChange,
    handleSortByDueDateChange,

    // Query states
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error
  };
}
