'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon, LoaderIcon } from 'lucide-react';
import { MasterUser } from '../composables/interface';

interface UserAutocompleteProps {
  users: MasterUser[];
  value: string | undefined;
  onChange: (userId: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  'aria-invalid'?: boolean;
}

export function UserAutocomplete({
  users,
  value,
  onChange,
  placeholder = 'Search users...',
  disabled = false,
  isLoading = false,
  'aria-invalid': ariaInvalid,
}: UserAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedUser = useMemo(() => users.find((u) => u.id === value), [users, value]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return users;
    const lower = debouncedSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.id.toLowerCase().includes(lower),
    );
  }, [users, debouncedSearch]);

  const visibleItems = useMemo(() => filtered.slice(0, 50), [filtered]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(user: MasterUser) {
    onChange(user.id);
    setSearch('');
    setOpen(false);
  }

  function handleToggle() {
    if (disabled) return;
    setOpen((prev) => {
      if (prev) return false;
      setSearch('');
      return true;
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    if (!open) setOpen(true);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative cursor-pointer" onClick={handleToggle}>
        <Input
          ref={inputRef}
          value={open ? search : (selectedUser?.name ?? '')}
          onChange={handleInputChange}
          placeholder={selectedUser ? selectedUser.name : placeholder}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          autoComplete="off"
          readOnly={!open}
        />
        {isLoading ? (
          <LoaderIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none animate-spin" />
        ) : (
          <ChevronsUpDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        )}
      </div>

      {open && !isLoading && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="max-h-60 overflow-y-auto p-1">
            {visibleItems.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">No users found.</div>
            ) : (
              <>
                {visibleItems.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={cn(
                      'group/item flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-primary-foreground cursor-pointer transition-colors',
                      value === user.id && 'bg-accent',
                    )}
                    onClick={() => handleSelect(user)}
                  >
                    <CheckIcon className={cn('size-4 shrink-0', value === user.id ? 'opacity-100' : 'opacity-0')} />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-medium truncate">{user.name}</span>
                      <span className="text-xs text-foreground/60 group-hover/item:text-foreground/60 truncate">
                        {user.email}
                      </span>
                      <span className="text-xs text-foreground/40 group-hover/item:text-foreground/40 truncate font-mono">
                        {user.id}
                      </span>
                    </div>
                  </button>
                ))}
                {filtered.length > 50 && (
                  <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                    Showing 50 of {filtered.length} results. Type to narrow down.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
