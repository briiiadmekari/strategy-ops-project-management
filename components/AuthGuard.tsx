"use client";

import { useSyncExternalStore } from "react";
import { redirect } from "next/navigation";
import { TOKEN_KEY } from "@/constant/auth";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useSyncExternalStore(subscribeToStorage, getToken, () => null);

  if (!token) {
    redirect("/login");
  }

  return <>{children}</>;
}
