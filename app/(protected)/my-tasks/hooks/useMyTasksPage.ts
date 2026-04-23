import { useMemo, useState } from 'react';
import { useMyTasks } from '../composables/queries';
import type { TaskStatus } from '@/constant/task';

export function useMyTasksPage() {
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [assigneeId, setAssigneeId] = useState<string | undefined>();
  const [sortByDueDate, setSortByDueDate] = useState<'asc' | 'desc' | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const {
    data: myTasksQueries,
    isPending,
    isLoading,
    isError,
    error,
  } = useMyTasks({
    page: 1,
    limit: 1000,
    status,
    assignee_id: assigneeId,
    sort_by_due_date: sortByDueDate,
  });

  const tasks = useMemo(() => {
    const allTasks = myTasksQueries?.data?.items ?? [];
    return selectedTag ? allTasks.filter((t) => t.tags?.includes(selectedTag)) : allTasks;
  }, [myTasksQueries?.data?.items, selectedTag]);

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
    status,
    assigneeId,
    sortByDueDate,
    selectedTag,
    handleStatusChange,
    handleAssigneeChange,
    handleSortByDueDateChange,
    handleTagChange,
    isLoading: isPending || isLoading,
    isError,
    error,
  };
}
