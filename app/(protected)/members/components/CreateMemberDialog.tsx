"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { PlusIcon } from "lucide-react";

import { createMemberSchema } from "../schema/memberSchema";
import { useCreateMember } from "../composables/mutations";
import { useUsers } from "../composables/queries";
import { UserAutocomplete } from "./UserAutocomplete";

export function CreateMemberDialog() {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const createMember = useCreateMember();
  const { data: usersData, isLoading: isUsersLoading } = useUsers(open);
  const users = usersData?.data ?? [];

  function resetForm() {
    setSelectedUserId(undefined);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = createMemberSchema.safeParse({ user_id: selectedUserId });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please select a user");
      return;
    }

    createMember.mutate(result.data, {
      onSuccess: () => {
        toast.success("Member added");
        setOpen(false);
        resetForm();
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message ?? "Failed to add member"
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Search and select a user to add to the team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>User</Label>
            <UserAutocomplete
              users={users}
              value={selectedUserId}
              onChange={setSelectedUserId}
              placeholder={isUsersLoading ? "Loading users..." : "Search users..."}
              disabled={isUsersLoading}
              isLoading={isUsersLoading}
              aria-invalid={!!error}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMember.isPending || !selectedUserId}>
              {createMember.isPending ? (
                <Spinner className="size-4" />
              ) : (
                "Add Member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
