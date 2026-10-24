import React from 'react';
import {
  LayoutDashboard,
  Tv,
  Coins,
  Building2,
  Users,
  BarChart3,
  Calendar,
  MessageSquareText,
  ShieldAlert,
  Code
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../services/i18n';

interface NavigationSubBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
}

export const NavigationSubBar: React.FC<NavigationSubBarProps> = ({
  currentTab,
  onSelectTab,
  language,
}) => {
  const t = translations[language];

  const items = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'dakwah', label: t.nav.dakwah, icon: Tv },
    { id: 'zakat', label: t.nav.zakat, icon: Coins },
    { id: 'wakaf', label: t.nav.wakaf, icon: Building2 },
    { id: 'sima', label: t.nav.sima, icon: Users },
    { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
    { id: 'calendar', label: t.nav.calendar, icon: Calendar },
    { id: 'consultation', label: t.nav.consultation, icon: MessageSquareText },
    { id: 'security', label: t.nav.security, icon: ShieldAlert },
    { id: 'apiDocs', label: t.nav.apiDocs, icon: Code },
  ];

  return (
    <div className="bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 py-2 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 min-w-max">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs dark:bg-emerald-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
