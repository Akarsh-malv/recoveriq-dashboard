import { ReactNode } from 'react';
import { SettingsSectionId } from '../../types/settings';

interface SectionNavItem {
  id: SettingsSectionId;
  label: string;
}

interface SettingsShellProps {
  activeSection: SettingsSectionId;
  sections: SectionNavItem[];
  onSectionChange: (sectionId: SettingsSectionId) => void;
  children: ReactNode;
}

export function SettingsShell({ activeSection, sections, onSectionChange, children }: SettingsShellProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_1fr]">
      <aside className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex gap-2 overflow-x-auto xl:flex-col xl:overflow-visible">
          {sections.map((section) => {
            const active = section.id === activeSection;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSectionChange(section.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-primary text-white' : 'text-neutral-mid hover:bg-neutral-light'
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </aside>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
