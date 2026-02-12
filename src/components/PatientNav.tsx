import { Home, TrendingUp, User } from 'lucide-react';

interface PatientNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function PatientNav({ currentView, onNavigate }: PatientNavProps) {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
        <div className="text-lg font-semibold text-gray-900">Patient Portal</div>
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
