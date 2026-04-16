"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquareIcon } from "lucide-react";

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquareIcon className="size-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">
            No comments yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Comments feature coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
