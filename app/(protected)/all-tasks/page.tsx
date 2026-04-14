"use client";

import { TaskTable, TaskFilter, CreateTaskDialog } from "@/components/tasks";
import { CustomTablePagination } from "@/components/CustomTablePagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { useAllTasksPage } from "./hooks/useAllTasksPage";

export default function AllTasksPage() {
  const {
    tasks,
    totalPages,
    members,
    page,
    limit,
    setPage,
    setLimit,
    status,
    assigneeId,
    sortByDueDate,
    handleStatusChange,
    handleAssigneeChange,
    handleSortByDueDateChange,
    isLoading,
    isError,
    error,
    isMembersLoading,
  } = useAllTasksPage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Tasks</h1>
          <p className="text-sm text-muted-foreground">
            All tasks across the team.
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      {isError && (
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertDescription>
            {error?.message ?? "Failed to load tasks."}
          </AlertDescription>
        </Alert>
      )}

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
          assigneeId={assigneeId}
          onAssigneeChange={handleAssigneeChange}
          sortByDueDate={sortByDueDate}
          onSortByDueDateChange={handleSortByDueDateChange}
          members={members}
          isMembersLoading={isMembersLoading}
        />
        <TaskTable data={tasks} isLoading={isLoading} />
      </CustomTablePagination>
    </div>
  );
}
