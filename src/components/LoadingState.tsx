import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-neutral-mid">{message}</p>
    </div>
  );
}
