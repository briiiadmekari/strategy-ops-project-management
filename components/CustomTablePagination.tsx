"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const LIMIT_OPTIONS = [10, 20, 30, 50] as const;

interface CustomTablePaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  children: React.ReactNode;
}

function PaginationControls({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: Omit<CustomTablePaginationProps, "children">) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Rows per page</span>
        <Select
          value={String(limit)}
          onValueChange={(value) => {
            onLimitChange(Number(value));
            onPageChange(1);
          }}
        >
          <SelectTrigger className="w-[70px] !text-xs">
            <SelectValue  />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={String(opt)} className="text-xs">
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-xs text-muted-foreground">
          Page {page} of {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="!text-xs"
          >
            <ChevronLeftIcon />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="!text-xs"
          >
            Next
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CustomTablePagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
  children,
}: CustomTablePaginationProps) {
  return (
    <div className="space-y-4">
      {children}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
