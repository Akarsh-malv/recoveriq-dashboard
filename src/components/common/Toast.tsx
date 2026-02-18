interface ToastProps {
  open: boolean;
  message: string;
}

export function Toast({ open, message }: ToastProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed right-5 top-5 z-50 rounded-lg border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success shadow-sm">
      {message}
    </div>
  );
}
