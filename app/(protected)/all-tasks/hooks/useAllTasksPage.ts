import { useMemo, useState } from 'react';
import { useAllTasks, useMembers } from '@/composables/queries';
import type { TaskStatus } from '@/constant/task';

export function useAllTasksPage() {
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [assigneeId, setAssigneeId] = useState<string | undefined>();
  const [sortByDueDate, setSortByDueDate] = useState<'asc' | 'desc' | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const {
    data: tasksData,
    isPending: isTasksPending,
    isLoading,
    isError,
    error,
  } = useAllTasks({
    page: 1,
    limit: 1000,
    status,
    assignee_id: assigneeId,
    sort_by_due_date: sortByDueDate,
  });

  const {
    data: membersData,
    isPending: isMembersPending,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useMembers();

  const allTasks = tasksData?.data?.items ?? [];
  const members = membersData?.data ?? [];

  const tasks = useMemo(
    () => (selectedTag ? allTasks.filter((t) => t.tags?.includes(selectedTag)) : allTasks),
    [allTasks, selectedTag],
  );

  function handleStatusChange(value: TaskStatus | undefined) {
    setStatus(value);
  }

  function handleAssigneeChange(value: string | undefined) {
    setAssigneeId(value);
  }

  function handleSortByDueDateChange(value: 'asc' | 'desc' | undefined) {
    setSortByDueDate(value);
  }

  function handleTagChange(value: string | undefined) {
    setSelectedTag(value);
  }

  return {
    tasks,
    members,
    status,
    assigneeId,
    sortByDueDate,
    selectedTag,
    handleStatusChange,
    handleAssigneeChange,
    handleSortByDueDateChange,
    handleTagChange,
    isLoading,
    isError,
    error,
    isMembersLoading,
  };
}
