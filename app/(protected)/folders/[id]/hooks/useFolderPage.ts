import { useState } from "react";
import { useFolderById, useFolderTasks, useMembers } from "@/composables/queries";
import { useUpdateFolder, useDeleteFolder } from "@/composables/mutations";
import { useMe } from "@/composables/queries";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import type { TaskStatus } from "@/constant/task";

export function useFolderPage(id: string) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [sortByDueDate, setSortByDueDate] = useState<"asc" | "desc" | undefined>();

  const folderQuery = useFolderById(id);
  const tasksQuery = useFolderTasks(id, {
    page,
    limit,
    status,
    sort_by_due_date: sortByDueDate,
  });
  const { data: meData } = useMe();
  const { data: membersData } = useMembers();
  const updateFolder = useUpdateFolder();
  const deleteFolder = useDeleteFolder();

  const folder = folderQuery.data?.data ?? null;
  const tasks = tasksQuery.data?.data?.items ?? [];
  const totalPages = tasksQuery.data?.data?.total_pages ?? 1;
  const members = membersData?.data ?? [];
  const isCreator = folder?.creator?.id === meData?.data?.id;

  function handleStatusChange(value: TaskStatus | undefined) {
    setStatus(value);
    setPage(1);
  }

  function handleSortByDueDateChange(value: "asc" | "desc" | undefined) {
    setSortByDueDate(value);
    setPage(1);
  }

  function handleAddMember(memberId: string) {
    if (!folder) return;
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    const current = folder.members ?? [];
    if (current.some((m) => m.id === memberId)) return;

    updateFolder.mutate(
      {
        id: folder.id,
        payload: {
          members: [...current, { id: member.id, name: member.name, email: member.email }],
        },
      },
      {
        onSuccess: () => toast.success("Member added"),
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message ?? "Failed to add member");
          } else {
            toast.error("An unexpected error occurred");
          }
        },
      },
    );
  }

  function handleRemoveMember(memberId: string) {
    if (!folder) return;
    const updated = (folder.members ?? []).filter((m) => m.id !== memberId);

    updateFolder.mutate(
      { id: folder.id, payload: { members: updated } },
      {
        onSuccess: () => toast.success("Member removed"),
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message ?? "Failed to remove member");
          } else {
            toast.error("An unexpected error occurred");
          }
        },
      },
    );
  }

  function handleDeleteFolder() {
    if (!folder) return;
    deleteFolder.mutate(folder.id, {
      onSuccess: () => {
        toast.success("Folder deleted");
        router.push("/my-tasks");
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message ?? "Failed to delete folder");
        } else {
          toast.error("An unexpected error occurred");
        }
      },
    });
  }

  return {
    folder,
    tasks,
    totalPages,
    members,
    isCreator,
    page,
    limit,
    setPage,
    setLimit,
    status,
    sortByDueDate,
    handleStatusChange,
    handleSortByDueDateChange,
    handleAddMember,
    handleRemoveMember,
    handleDeleteFolder,
    isLoading: folderQuery.isLoading,
    isTasksLoading: tasksQuery.isLoading,
    isError: folderQuery.isError,
    error: folderQuery.error,
    isUpdating: updateFolder.isPending,
    isDeleting: deleteFolder.isPending,
  };
}
