'use client';

import { Badge } from '@/components/ui/badge';
import { CustomTable } from '@/components/CustomTable';
import { TableRow, TableCell } from '@/components/ui/table';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/task';
import type { Row } from '@tanstack/react-table';
import { TASK_PRIORITY_LABELS, TASK_PRIORITY_COLORS } from '@/constant/task';
import { columns } from './partials/columns';

function renderSubRow(row: Row<Task>) {
  const subtasks = row.original.subtasks;
  if (!subtasks || subtasks.length === 0) return null;
  const colCount = row.getVisibleCells().length;
  // Columns: [expand, title, status, priority, assignee, start_date, due_date, tags, actions]
  // Show: title (indented in col 2), status (col 3), priority (col 4), rest empty
  const emptyTrailingCols = colCount - 4; // cols after priority

  return subtasks.map((subtask, i) => (
    <TableRow key={subtask.id ?? `sub-${i}`} className="bg-muted/30 hover:bg-muted/40">
      {/* expand col — empty */}
      <TableCell />
      {/* title — indented */}
      <TableCell className="pl-8 text-sm text-muted-foreground">{subtask.title}</TableCell>
      {/* status */}
      <TableCell>
        <TaskStatusBadge status={subtask.status} />
      </TableCell>
      {/* priority */}
      <TableCell>
        {subtask.priority ? (
          <Badge variant="secondary" className={cn('text-xs', TASK_PRIORITY_COLORS[subtask.priority])}>
            {TASK_PRIORITY_LABELS[subtask.priority]}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      {/* remaining cols empty */}
      {emptyTrailingCols > 0 && Array.from({ length: emptyTrailingCols }).map((_, j) => <TableCell key={j} />)}
    </TableRow>
  ));
}

interface TaskTableProps {
  data: Task[];
  isLoading?: boolean;
}

export function TaskTable({ data, isLoading }: TaskTableProps) {
  return (
    <CustomTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No tasks found."
      getRowCanExpand={(row) => Boolean(row.original.subtasks && row.original.subtasks.length > 0)}
      renderSubRow={renderSubRow}
    />
  );
}
