"use client";

import { use } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskTable, TaskFilter, CreateTaskDialog } from "@/components/tasks";
import { CustomTablePagination } from "@/components/CustomTablePagination";
import {
  ArrowLeftIcon,
  OctagonAlertIcon,
  TrashIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { useFolderPage } from "./hooks/useFolderPage";

export default function FolderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
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
    isLoading,
    isTasksLoading,
    isError,
    error,
    isUpdating,
    isDeleting,
  } = useFolderPage(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-tasks">
            <ArrowLeftIcon />
            Back
          </Link>
        </Button>
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertDescription>
            {error?.message ?? "Failed to load folder."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-tasks">
            <ArrowLeftIcon />
            Back
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Folder not found.</p>
      </div>
    );
  }

  // Members not in the folder yet (for adding)
  const availableMembers = members.filter(
    (m) => !folder.members.some((fm) => fm.id === m.id),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/my-tasks">
              <ArrowLeftIcon />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {folder.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <CreateTaskDialog defaultFolders={[{ id: folder.id, name: folder.name }]} />
          {isCreator && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  <TrashIcon />
                  Delete Folder
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete folder?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete the folder &quot;{folder.name}&quot;. Tasks inside will not be deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteFolder}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Members Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center">
            {folder.members.map((m) => (
              <Badge key={m.id} variant="secondary" className="gap-1.5">
                {m.name}
                {isCreator && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(m.id)}
                    disabled={isUpdating}
                    className="ml-0.5 hover:text-destructive"
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </Badge>
            ))}

            {isCreator && availableMembers.length > 0 && (
              <Select onValueChange={handleAddMember} disabled={isUpdating}>
                <SelectTrigger className="h-7 w-auto text-xs gap-1">
                  <UserPlusIcon className="size-3.5" />
                  <SelectValue placeholder="Add member" />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {folder.members.length === 0 && (
              <p className="text-sm text-muted-foreground">No members added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <CustomTablePagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      >
        <TaskFilter
          status={status}
          onStatusChange={handleStatusChange}
          assigneeId={undefined}
          onAssigneeChange={() => {}}
          sortByDueDate={sortByDueDate}
          onSortByDueDateChange={handleSortByDueDateChange}
          members={[]}
          isMembersLoading={false}
        />
        <TaskTable data={tasks} isLoading={isTasksLoading} />
      </CustomTablePagination>
    </div>
  );
}
