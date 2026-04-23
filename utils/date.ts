import { format } from 'date-fns';

export function formatDate(value: string | number | null | undefined): string {
  if (value == null) return '—';
  try {
    return format(new Date(value), 'dd/MM/yyyy');
  } catch {
    return '—';
  }
}

export function formatDateDisplay(value: string | number | null | undefined): string {
  if (value == null) return '—';
  try {
    return format(new Date(value), 'MMM d, yyyy');
  } catch {
    return '—';
  }
}
