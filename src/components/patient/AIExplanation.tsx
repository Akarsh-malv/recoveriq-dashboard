import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function AIExplanation() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        aria-label="Toggle explanation panel"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold text-gray-900">What does this mean?</h3>
        {open ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
      </button>
      {open && (
        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <p>Your resting heart rate was slightly above your usual pattern yesterday.</p>
          <p>This does not diagnose any condition.</p>
          <p>If your symptoms worsen or you feel unwell, contact your care team.</p>
          <p>For severe symptoms (e.g., chest pain), call emergency services.</p>
        </div>
      )}
    </section>
  );
}
