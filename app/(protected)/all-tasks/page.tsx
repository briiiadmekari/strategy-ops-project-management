"use client";

import { GroupedTaskTable, TaskFilter, CreateTaskDialog } from "@/components/tasks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { useAllTasksPage } from "./hooks/useAllTasksPage";

export default function AllTasksPage() {
  const {
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

      <TaskFilter
        status={status}
        onStatusChange={handleStatusChange}
        assigneeId={assigneeId}
        onAssigneeChange={handleAssigneeChange}
        sortByDueDate={sortByDueDate}
        onSortByDueDateChange={handleSortByDueDateChange}
        selectedTag={selectedTag}
        onTagChange={handleTagChange}
        members={members}
        isMembersLoading={isMembersLoading}
      />
      <GroupedTaskTable data={tasks} isLoading={isLoading} />
    </div>
  );
}
