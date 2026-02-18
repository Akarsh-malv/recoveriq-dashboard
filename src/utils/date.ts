const HOUR_MS = 60 * 60 * 1000;

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function hoursAgo(iso: string): number {
  const elapsed = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.round(elapsed / HOUR_MS));
}

export function isOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export function isDueToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function toDateTimeLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const offsetMinutes = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offsetMinutes * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function fromDateTimeLocalInputValue(value: string): string {
  return new Date(value).toISOString();
}
