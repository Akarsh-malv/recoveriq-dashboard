import { ReactNode } from 'react';

interface SettingsSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ id, title, description, children }: SettingsSectionProps) {
  return (
    <section id={id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
