"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { TaskFilter } from "@/components/tasks";
import { CustomTablePagination } from "@/components/CustomTablePagination";
import { OctagonAlertIcon } from "lucide-react";
import { useLogsPage } from "./hooks/useLogsPage";
import { LogsTable } from "./components/LogsTable";

export default function LogsPage() {
  const {
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
  } = useLogsPage();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Logs</h1>
        <p className="text-sm text-muted-foreground">
          Completed tasks older than 7 days.
        </p>
      </div>

      {isError && (
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertDescription>
            {error?.message ?? "Failed to load logs."}
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
          status={undefined}
          onStatusChange={() => {}}
          assigneeId={assigneeId}
          onAssigneeChange={handleAssigneeChange}
          sortByDueDate={sortByDueDate}
          onSortByDueDateChange={handleSortByDueDateChange}
          selectedTag={selectedTag}
          onTagChange={handleTagChange}
          members={members}
          isMembersLoading={isMembersLoading}
          hideStatusFilter
        />
        <LogsTable logs={logs} isLoading={isLoading} />
      </CustomTablePagination>
    </div>
  );
}
