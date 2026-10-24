/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { NavigationSubBar } from './components/layout/NavigationSubBar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { DakwahHub } from './components/dakwah/DakwahHub';
import { ZakatHub } from './components/zakat/ZakatHub';
import { MemberManagement } from './components/members/MemberManagement';
import { BranchAnalytics } from './components/analytics/BranchAnalytics';
import { IslamicCalendar } from './components/calendar/IslamicCalendar';
import { PaymentGatewayModal } from './components/zakat/PaymentGatewayModal';
import { SecurityModal } from './components/security/SecurityModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ApiDocsModal } from './components/api/ApiDocsModal';
import { GlobalConsultantHub } from './components/consultant/GlobalConsultantHub';
import { WakafHub } from './components/wakaf/WakafHub';

import {
  Language,
  Theme,
  ZakatTransaction,
  UserProfile,
  DakwahItem,
  ConsultationQuestion,
  PushNotification,
  VolunteerProject,
  VolunteerRegistration,
  ServiceHourLog,
  ConsultantExpert,
  ConsultationBooking,
  StrategicKnowledgeItem,
  CashWaqfProgram,
  ProductiveWaqfAsset,
  WaqfBlockchainTransaction,
  WaqfBlockchainBlock,
  WaqfPledgeRecord
} from './types';
import { StorageService } from './services/storage';
import {
  initialDakwahList,
  upcomingIslamicEvents,
  defaultPrayerTime
} from './data/mockData';
import { ExportService } from './services/exportService';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('mhd_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mhd_lang') as Language;
      if (saved === 'id' || saved === 'en' || saved === 'ar') return saved;
      // auto detect from browser
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('ar')) return 'ar';
      if (navLang.startsWith('en')) return 'en';
      return 'id';
    } catch {
      return 'id';
    }
  });

  // Online / Offline State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync dark class on document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mhd_theme', theme);
  }, [theme]);

  // Sync language
  useEffect(() => {
    localStorage.setItem('mhd_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Tab state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Application Data States
  const [transactions, setTransactions] = useState<ZakatTransaction[]>(() => StorageService.getZakatTransactions());
  const [members, setMembers] = useState<UserProfile[]>(() => StorageService.getMembers());
  const [consultations, setConsultations] = useState<ConsultationQuestion[]>(() => StorageService.getConsultations());
  const [notifications, setNotifications] = useState<PushNotification[]>(() => StorageService.getNotifications());
  const [volunteerProjects, setVolunteerProjects] = useState<VolunteerProject[]>(() => StorageService.getVolunteerProjects());
  const [volunteerRegistrations, setVolunteerRegistrations] = useState<VolunteerRegistration[]>(() => StorageService.getVolunteerRegistrations());
  const [serviceLogs, setServiceLogs] = useState<ServiceHourLog[]>(() => StorageService.getServiceHourLogs());
  const [consultantExperts, setConsultantExperts] = useState<ConsultantExpert[]>(() => StorageService.getConsultantExperts());
  const [consultationBookings, setConsultationBookings] = useState<ConsultationBooking[]>(() => StorageService.getConsultationBookings());
  const [strategicKnowledge, setStrategicKnowledge] = useState<StrategicKnowledgeItem[]>(() => StorageService.getStrategicKnowledge());
  const [cashWaqfPrograms, setCashWaqfPrograms] = useState<CashWaqfProgram[]>(() => StorageService.getCashWaqfPrograms());
  const [productiveWaqfAssets, setProductiveWaqfAssets] = useState<ProductiveWaqfAsset[]>(() => StorageService.getProductiveWaqfAssets());
  const [waqfBlockchainTransactions, setWaqfBlockchainTransactions] = useState<WaqfBlockchainTransaction[]>(() => StorageService.getWaqfBlockchainTransactions());
  const [waqfBlockchainBlocks, setWaqfBlockchainBlocks] = useState<WaqfBlockchainBlock[]>(() => StorageService.getWaqfBlockchainBlocks());
  const [waqfPledges, setWaqfPledges] = useState<WaqfPledgeRecord[]>(() => StorageService.getWaqfPledges());
  const dakwahList = initialDakwahList;

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentPreset, setPaymentPreset] = useState<{ program?: string; amount?: number }>({});
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState<boolean>(false);

  // Handlers
  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenPayment = (program?: string, amount?: number) => {
    setPaymentPreset({ program, amount });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (newTrx: ZakatTransaction) => {
    const updated = StorageService.addZakatTransaction(newTrx);
    setTransactions(updated);
    
    // Add real-time push notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Pembayaran Zakat Terverifikasi Sah',
      body: `Setoran ${newTrx.program} sebesar Rp ${newTrx.amount.toLocaleString('id-ID')} (${newTrx.code}) telah tercatat dalam buku besar publik LAZISMU.`,
      category: 'zakat',
      timestamp: 'Baru saja',
      read: false,
    };
    const updatedNotifs = StorageService.addNotification(newNotif);
    setNotifications(updatedNotifs);
  };

  const handleSaveMember = (newMember: UserProfile) => {
    const updated = StorageService.saveMember(newMember);
    setMembers(updated);

    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Penerbitan KTAM Digital Baru',
      body: `Kartu Tanda Anggota Muhammadiyah untuk ${newMember.name} (NBM: ${newMember.nbm}) telah dienkripsi dan aktif di cloud SIMA.`,
      category: 'persyarikatan',
      timestamp: 'Baru saja',
      read: false,
    };
    const updatedNotifs = StorageService.addNotification(newNotif);
    setNotifications(updatedNotifs);
  };

  const handleAddConsultation = (q: ConsultationQuestion) => {
    const updated = StorageService.addConsultation(q);
    setConsultations(updated);

    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Pertanyaan Konsultasi Dikirimkan',
      body: `Pertanyaan kategori ${q.category} Anda telah diterima sekretariat Majelis Tarjih untuk ditelaah.`,
      category: 'dakwah',
      timestamp: 'Baru saja',
      read: false,
    };
    const updatedNotifs = StorageService.addNotification(newNotif);
    setNotifications(updatedNotifs);
  };

  const handleMarkNotifAsRead = (id: string) => {
    const updated = StorageService.markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleSendNewNotification = (notif: PushNotification) => {
    const updated = StorageService.addNotification(notif);
    setNotifications(updated);
  };

  const handleRegisterVolunteer = (reg: VolunteerRegistration) => {
    const { registrations, projects } = StorageService.addVolunteerRegistration(reg);
    setVolunteerRegistrations(registrations);
    setVolunteerProjects(projects);

    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Pendaftaran Relawan Berhasil',
      body: `Relawan ${reg.memberName} berhasil terdaftar untuk tugas "${reg.roleAssigned}" pada misi ${reg.projectTitle}.`,
      category: 'emergency',
      timestamp: 'Baru saja',
      read: false,
    };
    const updatedNotifs = StorageService.addNotification(newNotif);
    setNotifications(updatedNotifs);
  };

  const handleAddServiceLog = (log: ServiceHourLog) => {
    const updated = StorageService.addServiceHourLog(log);
    setServiceLogs(updated);

    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Jam Khidmat Terverifikasi',
      body: `Pencatatan ${log.hours} jam pengabdian oleh ${log.memberName} pada ${log.projectTitle} telah disetujui supervisor lapangan.`,
      category: 'persyarikatan',
      timestamp: 'Baru saja',
      read: false,
    };
    const updatedNotifs = StorageService.addNotification(newNotif);
    setNotifications(updatedNotifs);
  };

  const handleApproveLog = (id: string) => {
    const updated = StorageService.updateServiceHourLogStatus(id, 'approved');
    setServiceLogs(updated);
  };

  const handleCreateConsultationBooking = (booking: ConsultationBooking) => {
    const updated = StorageService.addConsultationBooking(booking);
    setConsultationBookings(updated);

    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Jadwal Konsultasi Syariah Dikonfirmasi',
      body: `Konsultasi dengan ${booking.expertName} (${booking.pillar}) pada ${booking.date} pukul ${booking.timeSlot} telah terjadwal. Ruang virtual siap diakses.`,
      category: 'dakwah',
      timestamp: 'Baru saja',
      read: false,
    };
    const updatedNotifs = StorageService.addNotification(newNotif);
    setNotifications(updatedNotifs);
  };

  const handleAddWaqfPledge = (pledge: WaqfPledgeRecord) => {
    const result = StorageService.addWaqfPledge(pledge);
    setWaqfPledges(result.pledges);
    setCashWaqfPrograms(result.programs);
    setWaqfBlockchainTransactions(result.transactions);
    setTransactions(StorageService.getZakatTransactions());

    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Akta Ikrar Wakaf Terbit & Sah di M-Chain',
      body: `Wakaf uang Rp ${pledge.amount.toLocaleString('id-ID')} untuk "${pledge.programTitle}" telah divalidasi ke Block #${pledge.blockNumber} M-Chain dengan TxHash ${pledge.txHash.slice(0, 14)}...`,
      category: 'zakat',
      timestamp: 'Baru saja',
      read: false,
    };
    const updatedNotifs = StorageService.addNotification(newNotif);
    setNotifications(updatedNotifs);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Bar Header (Adheres to Top Bar Contract) */}
      <Header
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'security') setIsSecurityModalOpen(true);
          else if (tab === 'apiDocs') setIsApiDocsOpen(true);
          else setCurrentTab(tab);
        }}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isOnline={isOnline}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onOpenPaymentModal={() => handleOpenPayment()}
      />

      {/* Sub Navigation Bar for Deep Feature Navigation */}
      <NavigationSubBar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'security') setIsSecurityModalOpen(true);
          else if (tab === 'apiDocs') setIsApiDocsOpen(true);
          else setCurrentTab(tab);
        }}
        language={language}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Offline Warning Banner if connection drops */}
        {!isOnline && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
            <div>
              <strong>Mode Offline Aktif:</strong> Anda sedang menjelajahi salinan lokal cache. Transaksi dan data baru akan otomatis disinkronkan saat koneksi internet kembali pulih.
            </div>
            <span className="font-semibold text-[10px] bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded">
              Local Storage Mode
            </span>
          </div>
        )}

        {/* View Switcher */}
        {currentTab === 'dashboard' && (
          <OverviewDashboard
            transactions={transactions}
            members={members}
            events={upcomingIslamicEvents}
            prayerTime={defaultPrayerTime}
            language={language}
            onOpenPaymentModal={() => handleOpenPayment()}
            onNavigateTab={setCurrentTab}
            onPrintReceipt={ExportService.printReceiptPDF}
          />
        )}

        {currentTab === 'dakwah' && (
          <DakwahHub
            dakwahList={dakwahList}
            consultations={consultations}
            onAddConsultation={handleAddConsultation}
            language={language}
          />
        )}

        {currentTab === 'zakat' && (
          <ZakatHub
            transactions={transactions}
            onOpenPaymentModal={handleOpenPayment}
            onPrintReceipt={ExportService.printReceiptPDF}
            language={language}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'wakaf' && (
          <WakafHub
            programs={cashWaqfPrograms}
            productiveAssets={productiveWaqfAssets}
            blockchainTransactions={waqfBlockchainTransactions}
            blockchainBlocks={waqfBlockchainBlocks}
            pledges={waqfPledges}
            onAddPledge={handleAddWaqfPledge}
            onNavigateTab={setCurrentTab}
            language={language}
          />
        )}

        {currentTab === 'sima' && (
          <MemberManagement
            members={members}
            onSaveMember={handleSaveMember}
            language={language}
            volunteerProjects={volunteerProjects}
            volunteerRegistrations={volunteerRegistrations}
            serviceLogs={serviceLogs}
            onRegisterVolunteer={handleRegisterVolunteer}
            onAddServiceLog={handleAddServiceLog}
            onApproveLog={handleApproveLog}
          />
        )}

        {currentTab === 'analytics' && (
          <BranchAnalytics language={language} />
        )}

        {currentTab === 'calendar' && (
          <IslamicCalendar language={language} />
        )}

        {currentTab === 'consultation' && (
          <GlobalConsultantHub
            experts={consultantExperts}
            bookings={consultationBookings}
            knowledgeItems={strategicKnowledge}
            onAddBooking={handleCreateConsultationBooking}
            language={language}
          />
        )}

      </main>

      {/* Professional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              <span className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">M</span>
              <span>Islamicity Muhammadiyah Superapp</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Infrastruktur Kaffah Persyarikatan Berkemajuan · Hak Cipta © 2026 PP Muhammadiyah & LAZISMU
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Enkripsi AES-256 & 2FA
            </button>
            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Dokumentasi API
            </button>
            <button
              onClick={() => {
                const snap = StorageService.createBackupNow();
                alert(`Pencadangan cloud snapshot berhasil dibuat (${snap.id}).`);
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cadangan Cloud Otomatis
            </button>
            <button
              onClick={() => setCurrentTab('calendar')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Jadwal Shalat Hisab
            </button>
          </div>

          <div className="text-[11px] font-arabic text-emerald-700 dark:text-emerald-400 text-center md:text-right">
            وَلْتَكُن مِّنكُمْ أُمَّةٌ يَدْعُونَ إِلَى الْخَيْرِ
          </div>

        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        defaultProgram={paymentPreset.program}
        defaultAmount={paymentPreset.amount}
        onPaymentSuccess={handlePaymentSuccess}
        language={language}
      />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        language={language}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifAsRead}
        onSendNewNotification={handleSendNewNotification}
        language={language}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
        language={language}
      />

    </div>
  );
}
