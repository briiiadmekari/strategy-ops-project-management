"use client";

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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TrashIcon } from "lucide-react";
import { useDeleteTaskDialog } from "./hooks/useDeleteTaskDialog";

interface DeleteTaskDialogProps {
  taskId: string;
  taskTitle: string;
}

export function DeleteTaskDialog({ taskId, taskTitle }: DeleteTaskDialogProps) {
  const { isPending, handleDelete } = useDeleteTaskDialog(taskId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-red-500/10 hover:bg-red-500/20"
          size="sm"
        >
          <TrashIcon className="text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{taskTitle}&rdquo;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {isPending ? <Spinner className="size-4" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
