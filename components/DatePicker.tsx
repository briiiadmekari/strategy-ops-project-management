"use client";

import { useState, useRef, useEffect } from "react";
import { format, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  label: string;
  value: string | undefined;
  onChange: (val: string | undefined) => void;
}

export function DatePicker({ label, value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date())
    : undefined;

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label>{label}</Label>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <CalendarIcon className="size-4" />
        {value ? format(selectedDate!, "dd/MM/yyyy") : "Pick a date"}
      </Button>
      {open && (
        <div className="absolute z-50 mt-1 rounded-md border bg-popover shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onChange(date ? format(date, "yyyy-MM-dd") : undefined);
              setOpen(false);
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  );
}
