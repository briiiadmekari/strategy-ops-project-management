"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface CustomDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isPending?: boolean;
  className?: string;
}

export function CustomDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
  isPending,
  className,
}: CustomDialogProps) {
  const handleCancel = onCancel ?? (() => onOpenChange?.(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("sm:max-w-lg max-h-[85vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {onSubmit ? (
          <form onSubmit={onSubmit} className="space-y-4 overflow-hidden">
            {children}
            {footer ?? (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  {cancelLabel}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner className="size-4" /> : submitLabel}
                </Button>
              </DialogFooter>
            )}
          </form>
        ) : (
          <>
            {children}
            {footer}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
