import React from 'react';
import { ShieldCheck, Moon, Sun, Globe, Bell, Wifi, WifiOff } from 'lucide-react';
import { Language, Theme } from '../../types';
import { translations } from '../../services/i18n';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onToggleTheme: () => void;
  isOnline: boolean;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenSecurity: () => void;
  onOpenPaymentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  isOnline,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenSecurity,
  onOpenPaymentModal,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="text-lg font-bold tracking-tight text-emerald-800 dark:text-emerald-400 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2 text-left"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            M
          </span>
          <span>Islamicity Muhammadiyah</span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'dashboard'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.dashboard}
          </button>
          <button
            onClick={() => onSelectTab('dakwah')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'dakwah'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.dakwah}
          </button>
          <button
            onClick={() => onSelectTab('zakat')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'zakat'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.zakat}
          </button>
          <button
            onClick={() => onSelectTab('wakaf')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'wakaf'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.wakaf}
          </button>
          <button
            onClick={() => onSelectTab('sima')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'sima'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.sima}
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'analytics'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.analytics}
          </button>
          <button
            onClick={() => onSelectTab('calendar')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'calendar'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav.calendar}
          </button>
        </nav>

        {/* Zone 3: 1 primary action & utility cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Online/Offline status indicator */}
          <div
            title={isOnline ? t.common.online : t.common.offline}
            className="flex items-center text-xs text-slate-500 dark:text-slate-400"
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-500" />
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative group">
            <button
              aria-label="Pilih Bahasa"
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold uppercase"
            >
              <Globe className="w-4 h-4" />
              <span>{language}</span>
            </button>
            <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 hidden group-hover:block group-focus-within:block z-50">
              <button
                onClick={() => onLanguageChange('id')}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  language === 'id' ? 'font-bold text-emerald-600' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Bahasa (ID)
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  language === 'en' ? 'font-bold text-emerald-600' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                English (EN)
              </button>
              <button
                onClick={() => onLanguageChange('ar')}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  language === 'ar' ? 'font-bold text-emerald-600' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                العربية (AR)
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Ganti Mode Gelap/Terang"
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Pusat Notifikasi Push"
            className="relative p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </button>

          {/* Security & 2FA modal trigger */}
          <button
            onClick={onOpenSecurity}
            title={t.security.title}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>2FA & E2EE</span>
          </button>

          {/* Primary Action Button: Bayar Zakat / Donasi */}
          <button
            onClick={onOpenPaymentModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            {t.dashboard.payZakat}
          </button>
        </div>

      </div>
    </header>
  );
};
