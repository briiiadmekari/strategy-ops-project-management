import { useMemo, useState } from "react";
import { useTaskLogs, useMembers } from "@/composables/queries";

export function useLogsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [assigneeId, setAssigneeId] = useState<string | undefined>();
  const [sortByDueDate, setSortByDueDate] = useState<
    "asc" | "desc" | undefined
  >();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const logsQuery = useTaskLogs({
    page,
    limit,
    assignee_id: assigneeId,
    sort_by_due_date: sortByDueDate,
  });

  const membersQuery = useMembers();

  const allLogs = logsQuery.data?.data?.items ?? [];
  const totalPages = logsQuery.data?.data?.total_pages ?? 1;
  const members = membersQuery.data?.data ?? [];

  const logs = useMemo(
    () =>
      selectedTag
        ? allLogs.filter((l) => l.tags?.includes(selectedTag))
        : allLogs,
    [allLogs, selectedTag],
  );

  function handleAssigneeChange(value: string | undefined) {
    setAssigneeId(value);
    setPage(1);
  }

  function handleSortByDueDateChange(value: "asc" | "desc" | undefined) {
    setSortByDueDate(value);
    setPage(1);
  }

  function handleTagChange(value: string | undefined) {
    setSelectedTag(value);
    setPage(1);
  }

  return {
    logs,
    members,
    page,
    limit,
    totalPages,
    setPage,
    setLimit,
    assigneeId,
    sortByDueDate,
    selectedTag,
    handleAssigneeChange,
    handleSortByDueDateChange,
    handleTagChange,
    isLoading: logsQuery.isLoading,
    isError: logsQuery.isError,
    error: logsQuery.error,
    isMembersLoading: membersQuery.isLoading,
  };
}
