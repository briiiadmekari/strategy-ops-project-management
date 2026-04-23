'use client';

import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CustomDialog } from '@/components/CustomDialog';
import { Label } from '@/components/ui/label';
import { PlusIcon } from 'lucide-react';

import { UserAutocomplete } from './UserAutocomplete';
import { useCreateMemberForm } from '../hooks/useCreateMemberForm';

export function CreateMemberDialog() {
  const { open, form, users, isUsersLoading, isPending, handleOpenChange, handleSubmit } = useCreateMemberForm();

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <CustomDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button size="sm">
          <PlusIcon />
          Add Member
        </Button>
      }
      title="Add Member"
      description="Search and select a user to add to the team."
      onSubmit={handleSubmit}
      submitLabel="Add Member"
      isPending={isPending}
    >
      <div className="space-y-2">
        <Label>User</Label>
        <Controller
          control={control}
          name="user_id"
          render={({ field }) => (
            <UserAutocomplete
              users={users}
              value={field.value || undefined}
              onChange={(val) => field.onChange(val ?? '')}
              placeholder={isUsersLoading ? 'Loading users...' : 'Search users...'}
              disabled={isUsersLoading}
              isLoading={isUsersLoading}
              aria-invalid={!!errors.user_id}
            />
          )}
        />
        {errors.user_id && <p className="text-xs text-destructive">{errors.user_id.message}</p>}
      </div>
    </CustomDialog>
  );
}
