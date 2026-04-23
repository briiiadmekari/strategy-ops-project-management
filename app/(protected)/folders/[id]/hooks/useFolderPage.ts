import { useMemo, useState } from 'react';
import { useFolderById, useFolderTasks, useMembers } from '@/composables/queries';
import { useUpdateFolder, useDeleteFolder } from '@/composables/mutations';
import { useMe } from '@/composables/queries';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import type { TaskStatus } from '@/constant/task';

export function useFolderPage(id: string) {
  const router = useRouter();
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [sortByDueDate, setSortByDueDate] = useState<'asc' | 'desc' | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const {
    data: folderData,
    isPending: isFolderPending,
    isLoading: isFolderLoading,
    isError: isFolderError,
    error: folderError,
  } = useFolderById(id);
  const {
    data: tasksData,
    isPending: isTasksPending,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useFolderTasks(id, {
    page: 1,
    limit: 1000,
    status,
    sort_by_due_date: sortByDueDate,
  });
  const { data: meData, isPending: isMePending, isLoading: isMeLoading, isError: isMeError } = useMe();
  const {
    data: membersData,
    isPending: isMembersPending,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useMembers();
  const { mutate: updateFolder, isPending: isUpdating, isError: isUpdateError } = useUpdateFolder();
  const { mutate: deleteFolder, isPending: isDeleting, isError: isDeleteError } = useDeleteFolder();

  const folder = folderData?.data ?? null;
  const allTasks = tasksData?.data?.items ?? [];

  const tasks = useMemo(
    () => (selectedTag ? allTasks.filter((t) => t.tags?.includes(selectedTag)) : allTasks),
    [allTasks, selectedTag],
  );
  const members = membersData?.data ?? [];
  const isCreator = folder?.creator?.id === meData?.data?.id;

  function handleStatusChange(value: TaskStatus | undefined) {
    setStatus(value);
  }

  function handleSortByDueDateChange(value: 'asc' | 'desc' | undefined) {
    setSortByDueDate(value);
  }

  function handleTagChange(value: string | undefined) {
    setSelectedTag(value);
  }

  function handleAddMember(memberId: string) {
    if (!folder) return;
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    const current = folder.members ?? [];
    if (current.some((m) => m.id === memberId)) return;

    updateFolder(
      {
        id: folder.id,
        payload: {
          members: [...current, { id: member.id, name: member.name, email: member.email }],
        },
      },
      {
        onSuccess: () => toast.success('Member added'),
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message ?? 'Failed to add member');
          } else {
            toast.error('An unexpected error occurred');
          }
        },
      },
    );
  }

  function handleRemoveMember(memberId: string) {
    if (!folder) return;
    const updated = (folder.members ?? []).filter((m) => m.id !== memberId);

    updateFolder(
      { id: folder.id, payload: { members: updated } },
      {
        onSuccess: () => toast.success('Member removed'),
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message ?? 'Failed to remove member');
          } else {
            toast.error('An unexpected error occurred');
          }
        },
      },
    );
  }

  function handleDeleteFolder() {
    if (!folder) return;
    deleteFolder(folder.id, {
      onSuccess: () => {
        toast.success('Folder deleted');
        router.push('/my-tasks');
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? 'Failed to delete folder');
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    });
  }

  function handleRenameFolder(newName: string) {
    if (!folder || !newName.trim()) return;
    updateFolder(
      { id: folder.id, payload: { name: newName.trim() } },
      {
        onSuccess: () => {
          toast.success('Folder renamed');
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message ?? 'Failed to rename folder');
          } else {
            toast.error('An unexpected error occurred');
          }
        },
      },
    );
  }

  return {
    folder,
    tasks,
    members,
    isCreator,
    status,
    sortByDueDate,
    selectedTag,
    handleStatusChange,
    handleSortByDueDateChange,
    handleTagChange,
    handleAddMember,
    handleRemoveMember,
    handleDeleteFolder,
    handleRenameFolder,
    isLoading: isFolderLoading,
    isTasksLoading,
    isError: isFolderError,
    error: folderError,
    isUpdating,
    isDeleting,
  };
}
