'use client';

import { useMembers } from '../composables/queries';

export function useMembersPage() {
  const { data: membersData, isPending, isLoading, isError, error } = useMembers();

  const members = membersData?.data ?? [];

  return {
    members,
    isLoading,
    isError,
    error,
  };
}
