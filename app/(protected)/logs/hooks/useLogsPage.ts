import { useMemo, useState } from 'react';
import { useTaskLogs, useMembers } from '@/composables/queries';

export function useLogsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [assigneeId, setAssigneeId] = useState<string | undefined>();
  const [sortByDueDate, setSortByDueDate] = useState<'asc' | 'desc' | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const {
    data: logsData,
    isPending: isLogsPending,
    isLoading,
    isError,
    error,
  } = useTaskLogs({
    page,
    limit,
    assignee_id: assigneeId,
    sort_by_due_date: sortByDueDate,
  });

  const {
    data: membersData,
    isPending: isMembersPending,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useMembers();

  const allLogs = logsData?.data?.items ?? [];
  const totalPages = logsData?.data?.total_pages ?? 1;
  const members = membersData?.data ?? [];

  const logs = useMemo(
    () => (selectedTag ? allLogs.filter((l) => l.tags?.includes(selectedTag)) : allLogs),
    [allLogs, selectedTag],
  );

  function handleAssigneeChange(value: string | undefined) {
    setAssigneeId(value);
    setPage(1);
  }

  function handleSortByDueDateChange(value: 'asc' | 'desc' | undefined) {
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
    isLoading,
    isError,
    error,
    isMembersLoading,
  };
}
