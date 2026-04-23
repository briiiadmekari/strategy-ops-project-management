import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  type TaskStatus,
} from "@/constant/task";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(TASK_STATUS_COLORS[status])}>
      {TASK_STATUS_LABELS[status]}
    </Badge>
  );
}
