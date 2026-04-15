import { useMemo, useState } from "react";
import { useMyTasks } from "@/composables/queries";
import type { TaskStatus } from "@/constant/task";

export function useMyTasksPage() {
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [assigneeId, setAssigneeId] = useState<string | undefined>();
  const [sortByDueDate, setSortByDueDate] = useState<
    "asc" | "desc" | undefined
  >();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const tasksQuery = useMyTasks({
    page: 1,
    limit: 1000,
    status,
    assignee_id: assigneeId,
    sort_by_due_date: sortByDueDate,
  });

  const allTasks = tasksQuery.data?.data?.items ?? [];

  const tasks = useMemo(
    () =>
      selectedTag
        ? allTasks.filter((t) => t.tags?.includes(selectedTag))
        : allTasks,
    [allTasks, selectedTag],
  );

  function handleStatusChange(value: TaskStatus | undefined) {
    setStatus(value);
  }

  function handleAssigneeChange(value: string | undefined) {
    setAssigneeId(value);
  }

  function handleSortByDueDateChange(value: "asc" | "desc" | undefined) {
    setSortByDueDate(value);
  }

  function handleTagChange(value: string | undefined) {
    setSelectedTag(value);
  }

  return {
    tasks,
    status,
    assigneeId,
    sortByDueDate,
    selectedTag,
    handleStatusChange,
    handleAssigneeChange,
    handleSortByDueDateChange,
    handleTagChange,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
  };
}
