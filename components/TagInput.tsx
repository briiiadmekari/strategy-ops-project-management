"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  maxTags = 10,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;
    if (value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInput("");
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
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
    <div className="space-y-2">
      <Label>{label}</Label>
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
    </div>
  );
}
