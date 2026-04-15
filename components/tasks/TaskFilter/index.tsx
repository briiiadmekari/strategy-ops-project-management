"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TASK_STATUSES, TASK_STATUS_LABELS, type TaskStatus } from "@/constant/task";
import { TASK_TAGS, TASK_TAG_COLORS, type TaskTag } from "@/constant/task";
import type { Member } from "@/services/task.service";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFilterProps {
  status?: TaskStatus;
  onStatusChange: (status: TaskStatus | undefined) => void;
  assigneeId?: string;
  onAssigneeChange: (assigneeId: string | undefined) => void;
  sortByDueDate?: "asc" | "desc";
  onSortByDueDateChange: (sort: "asc" | "desc" | undefined) => void;
  selectedTag?: string;
  onTagChange?: (tag: string | undefined) => void;
  members: Member[] | [];
  isMembersLoading?: boolean;
  hideStatusFilter?: boolean;
}

export function TaskFilter({
  status,
  onStatusChange,
  assigneeId,
  onAssigneeChange,
  sortByDueDate,
  onSortByDueDateChange,
  selectedTag,
  onTagChange,
  members,
  isMembersLoading,
  hideStatusFilter,
}: TaskFilterProps) {
  const hasFilters = status || assigneeId || sortByDueDate || selectedTag;

  function handleClearFilters() {
    onStatusChange(undefined);
    onAssigneeChange(undefined);
    onSortByDueDateChange(undefined);
    onTagChange?.(undefined);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!hideStatusFilter && (
        <Select
          value={status ?? "all"}
          onValueChange={(value) =>
            onStatusChange(value === "all" ? undefined : (value as TaskStatus))
          }
        >
          <SelectTrigger className="w-[160px]" size="sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {TASK_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {members.length > 0 && (
        <Select
          value={assigneeId ?? "all"}
          onValueChange={(value) =>
            onAssigneeChange(value === "all" ? undefined : value)
          }
          disabled={isMembersLoading}
        >
          <SelectTrigger className="w-[180px]" size="sm">
            <SelectValue placeholder="All Assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={sortByDueDate ?? "none"}
        onValueChange={(value) =>
          onSortByDueDateChange(
            value === "none" ? undefined : (value as "asc" | "desc"),
          )
        }
      >
        <SelectTrigger className="w-[180px]" size="sm">
          <SelectValue placeholder="Due Date Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Due Date Sort</SelectItem>
          <SelectItem value="asc">Due Date: Earliest</SelectItem>
          <SelectItem value="desc">Due Date: Latest</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <XIcon />
          Clear filters
        </Button>
      )}

      {onTagChange && (
        <div className="flex flex-wrap items-center gap-1.5 w-full pt-1">
          <span className="text-xs text-muted-foreground mr-1">Tags:</span>
          {TASK_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className={cn(
                "cursor-pointer capitalize text-xs",
                selectedTag === tag && TASK_TAG_COLORS[tag],
              )}
              onClick={() => onTagChange(selectedTag === tag ? undefined : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
