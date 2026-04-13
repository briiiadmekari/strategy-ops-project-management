"use client";

import { useMembers } from "../composables/queries";

export function useMembersPage() {
  const { data, isLoading, isError, error } = useMembers();

  const members = data?.data ?? [];

  return {
    members,
    isLoading,
    isError,
    error,
  };
}
