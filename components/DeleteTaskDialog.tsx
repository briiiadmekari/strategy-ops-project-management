"use client";

import { toast } from "sonner";
import { AxiosError } from "axios";

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
import { useDeleteTask } from "@/composables/mutations";

interface DeleteTaskDialogProps {
  taskId: string;
  taskTitle: string;
}

export function DeleteTaskDialog({ taskId, taskTitle }: DeleteTaskDialogProps) {
  const deleteTask = useDeleteTask();

  function handleDelete() {
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        toast.success("Task deleted");
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message ?? "Failed to delete task",
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="bg-red-500/10 hover:bg-red-500/20" size="sm">
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
            disabled={deleteTask.isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {deleteTask.isPending ? <Spinner className="size-4" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
