"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/composables/queries";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserProfile() {
  const { data: meData, isLoading } = useMe();
  const user = meData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-right">
          <Skeleton className="h-3.5 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="size-8 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="text-right">
        <p className="text-sm font-medium leading-none">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.org}</p>
      </div>
      <Avatar size="default">
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
