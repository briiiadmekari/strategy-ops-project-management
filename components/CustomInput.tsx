"use client";

import { useState, useRef, useEffect } from "react";
import { format, parse } from "date-fns";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, XIcon } from "lucide-react";
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
  value?: string;
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

  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date())
    : undefined;

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
        {value ? format(selectedDate!, "dd/MM/yyyy") : "Pick a date"}
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
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;
    onTagsChange([...value, trimmed]);
    setInput("");
  }

  function removeTag(index: number) {
    onTagsChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div
        className="flex flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, i) => (
          <Badge key={i} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              className="rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="h-auto min-w-20 flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
        />
      </div>
      {value.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum of {maxTags} tags reached.
        </p>
      )}
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
