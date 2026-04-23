'use client';

import { use, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
} from '@/components/ui/alert-dialog';
import { GroupedTaskTable } from '@/components/GroupedTaskTable';
import { TaskFilter } from '@/components/TaskFilter';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { ArrowLeftIcon, OctagonAlertIcon, TrashIcon, UserPlusIcon, XIcon, PencilIcon, CheckIcon } from 'lucide-react';
import { useFolderPage } from './hooks/useFolderPage';

export default function FolderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    folder,
    tasks,
    members,
    isCreator,
    status,
    sortByDueDate,
    selectedTag,
    handleStatusChange,
    handleSortByDueDateChange,
    handleTagChange,
    handleAddMember,
    handleRemoveMember,
    handleDeleteFolder,
    handleRenameFolder,
    isLoading,
    isTasksLoading,
    isError,
    error,
    isUpdating,
    isDeleting,
  } = useFolderPage(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-tasks">
            <ArrowLeftIcon />
            Back
          </Link>
        </Button>
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertDescription>{error?.message ?? 'Failed to load folder.'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-tasks">
            <ArrowLeftIcon />
            Back
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Folder not found.</p>
      </div>
    );
  }

  // Members not in the folder yet (for adding)
  const availableMembers = members.filter((m) => !folder.members.some((fm) => fm.id === m.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/my-tasks">
              <ArrowLeftIcon />
              Back
            </Link>
          </Button>
          <FolderNameEditor name={folder.name} isCreator={isCreator} onRename={handleRenameFolder} />
        </div>
        <div className="flex items-center gap-2">
          <CreateTaskDialog defaultFolders={[{ id: folder.id, name: folder.name }]} />
          {isCreator && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  <TrashIcon />
                  Delete Folder
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete folder?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete the folder &quot;{folder.name}&quot;. Tasks inside will not be deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteFolder}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Members Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center">
            {folder.members.map((m) => (
              <Badge key={m.id} variant="secondary" className="gap-1.5">
                {m.name}
                {isCreator && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(m.id)}
                    disabled={isUpdating}
                    className="ml-0.5 hover:text-destructive"
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </Badge>
            ))}

            {isCreator && availableMembers.length > 0 && (
              <Select onValueChange={handleAddMember} disabled={isUpdating}>
                <SelectTrigger className="h-7 w-auto text-xs gap-1">
                  <UserPlusIcon className="size-3.5" />
                  <SelectValue placeholder="Add member" />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {folder.members.length === 0 && <p className="text-sm text-muted-foreground">No members added yet.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <div className="space-y-4">
        <TaskFilter
          status={status}
          onStatusChange={handleStatusChange}
          assigneeId={undefined}
          onAssigneeChange={() => {}}
          sortByDueDate={sortByDueDate}
          onSortByDueDateChange={handleSortByDueDateChange}
          selectedTag={selectedTag}
          onTagChange={handleTagChange}
          members={[]}
          isMembersLoading={false}
        />
        <GroupedTaskTable data={tasks} isLoading={isTasksLoading} />
      </div>
    </div>
  );
}

function FolderNameEditor({
  name,
  isCreator,
  onRename,
}: {
  name: string;
  isCreator: boolean;
  onRename: (newName: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  if (!isCreator) {
    return <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>;
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="text-2xl font-semibold h-10 w-64"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onRename(value);
              setEditing(false);
            }
            if (e.key === 'Escape') {
              setValue(name);
              setEditing(false);
            }
          }}
        />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            onRename(value);
            setEditing(false);
          }}
        >
          <CheckIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            setValue(name);
            setEditing(false);
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => {
          setValue(name);
          setEditing(true);
        }}
      >
        <PencilIcon className="size-4" />
      </Button>
    </div>
  );
}
