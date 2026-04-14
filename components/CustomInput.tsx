"use client";

import { useState, useRef, useEffect } from "react";
import { format, parse } from "date-fns";
import { type Tag, TagInput as EmblrTagInput } from "emblor";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Shared ──────────────────────────────────────────────

interface BaseProps {
  label?: string;
  error?: string;
  className?: string;
}

// ── Text / Number ───────────────────────────────────────

interface TextInputProps
  extends BaseProps,
    Omit<React.ComponentProps<typeof Input>, "className"> {
  type?: "text" | "number" | "email" | "password";
}

function TextInput({ label, error, className, ...props }: TextInputProps) {
  const inputId =
    props.id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Input id={inputId} aria-invalid={!!error} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Textarea ────────────────────────────────────────────

interface TextareaInputProps
  extends BaseProps,
    Omit<React.ComponentProps<typeof Textarea>, "className"> {
  type: "textarea";
}

function TextareaInput({
  label,
  error,
  className,
  ...props
}: Omit<TextareaInputProps, "type">) {
  const inputId =
    props.id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Textarea id={inputId} aria-invalid={!!error} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Select ──────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectInputProps extends BaseProps {
  type: "select";
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  size?: "sm" | "default";
}

function SelectInput({
  label,
  error,
  className,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  triggerClassName,
  size,
}: SelectInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={triggerClassName} size={size}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.icon ? (
                <span className="flex items-center gap-2">
                  {opt.icon}
                  {opt.label}
                </span>
              ) : (
                opt.label
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Date ────────────────────────────────────────────────

interface DateInputProps extends BaseProps {
  type: "date";
  value?: string | number;
  onDateChange: (val: string | undefined) => void;
}

function DateInput({
  label,
  error,
  className,
  value,
  onDateChange,
}: DateInputProps) {
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

  const selectedDate = (() => {
    if (!value) return undefined;
    if (typeof value === "number") return new Date(value);
    if (typeof value === "string") {
      // Try yyyy-MM-dd first, fallback to direct Date parse for ISO/timestamps
      const parsed = parse(value, "yyyy-MM-dd", new Date());
      return isNaN(parsed.getTime()) ? new Date(value) : parsed;
    }
    return undefined;
  })();

  return (
    <div ref={containerRef} className={cn("relative space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <CalendarIcon className="size-4" />
        {selectedDate && !isNaN(selectedDate.getTime())
          ? format(selectedDate, "dd/MM/yyyy")
          : "Pick a date"}
      </Button>
      {open && (
        <div className="absolute z-50 mt-1 rounded-md border bg-popover shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onDateChange(date ? format(date, "yyyy-MM-dd") : undefined);
              setOpen(false);
            }}
            initialFocus
          />
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Tags ────────────────────────────────────────────────

interface TagsInputProps extends BaseProps {
  type: "tags";
  value: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

function TagsInput({
  label,
  error,
  className,
  value,
  onTagsChange,
  placeholder = "Type and press Enter",
  maxTags = 10,
}: TagsInputProps) {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const tags: Tag[] = value.map((text) => ({ id: text, text }));

  function handleSetTags(
    newTags: Tag[] | ((prev: Tag[]) => Tag[]),
  ) {
    const resolved = typeof newTags === "function" ? newTags(tags) : newTags;
    onTagsChange(resolved.map((t) => t.text));
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <EmblrTagInput
        tags={tags}
        setTags={handleSetTags}
        placeholder={placeholder}
        maxTags={maxTags}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Discriminated Union Export ───────────────────────────

type CustomInputProps =
  | TextInputProps
  | TextareaInputProps
  | SelectInputProps
  | DateInputProps
  | TagsInputProps;

export function CustomInput(props: CustomInputProps) {
  const { type } = props as { type?: string };

  switch (type) {
    case "textarea":
      return <TextareaInput {...(props as TextareaInputProps)} />;
    case "select":
      return <SelectInput {...(props as SelectInputProps)} />;
    case "date":
      return <DateInput {...(props as DateInputProps)} />;
    case "tags":
      return <TagsInput {...(props as TagsInputProps)} />;
    default:
      return <TextInput {...(props as TextInputProps)} />;
  }
}
