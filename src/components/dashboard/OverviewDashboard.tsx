import React from 'react';
import {
  Users,
  Coins,
  Tv,
  Building2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Radio,
  FileSpreadsheet,
  Download,
  Receipt,
  HeartHandshake
} from 'lucide-react';
import { ZakatTransaction, UserProfile, IslamicEvent, PrayerTimeData, Language } from '../../types';
import { translations } from '../../services/i18n';
import { ExportService } from '../../services/exportService';

interface OverviewDashboardProps {
  transactions: ZakatTransaction[];
  members: UserProfile[];
  events: IslamicEvent[];
  prayerTime: PrayerTimeData;
  language: Language;
  onOpenPaymentModal: () => void;
  onNavigateTab: (tab: string) => void;
  onPrintReceipt: (trx: ZakatTransaction) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  transactions,
  members,
  events,
  prayerTime,
  language,
  onOpenPaymentModal,
  onNavigateTab,
  onPrintReceipt,
}) => {
  const t = translations[language];

  const totalZakatAmount = transactions.reduce((acc, curr) => acc + curr.amount, 586240000000);

  return (
    <div className="space-y-8">
      
      {/* Hero Banner with Islamic Cultural Architecture */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <img
          src="/src/assets/images/hero_islamicity_portal_1792815210035.jpg"
          alt="Pusat Kebudayaan dan Peradaban Islamicity Muhammadiyah"
          referrerPolicy="no-referrer"
          className="w-full h-56 sm:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
          <div className="text-xs uppercase tracking-widest text-emerald-300 font-semibold mb-1">
            Persyarikatan Muhammadiyah · Gerakan Islam Berkemajuan
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-2xl text-balance">
            Superaplikasi Konsultan Islamicity & Infrastruktur Kaffah Nasional
          </h1>
          <p className="text-sm text-slate-200 mt-2 max-w-xl hidden sm:block">
            Integrasi satu pintu layanan dakwah pencerahan, kalkulasi & transparansi zakat LAZISMU, serta sistem informasi manajemen anggota berbasis cloud terenkripsi.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
            <span className="text-emerald-300 font-semibold">{t.common.realtime}</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-300">{t.common.encrypted}</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-300">ISO 27001 Cloud Verified</span>
          </div>
        </div>
      </div>

      {/* 4-Zone Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.dashboard.nationalMembers}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            3.742.890
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-600 font-medium">+18.420</span>
            <span>bulan ini</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.dashboard.activeBranches}</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            14.825
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span>38 PWM · 514 PDM se-Indonesia</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.dashboard.ziswafYtd}</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-400 tabular-nums">
            Rp 586,2 M
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span>Tersalurkan 100% transparan</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.dashboard.dakwahReach}</span>
            <Tv className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            1.240.500
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-600 font-medium">94.8%</span>
            <span>kepuasan jemaah</span>
          </div>
        </div>

      </div>

      {/* Synchronized Prayer Times & Today's Calendar Strip */}
      <div className="p-5 bg-emerald-900 text-white rounded-xl shadow-xs border border-emerald-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-emerald-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <Clock className="w-4 h-4" />
              <span>{t.dashboard.todayPrayers}</span>
              <span aria-hidden="true">·</span>
              <span>{prayerTime.city}</span>
            </div>
            <div className="text-lg font-bold mt-0.5">
              {prayerTime.hijriDateStr} · Kalender Internasional Tarjih
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Lihat Kalender Hijriah Lengkap</span>
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4 text-center">
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50">
            <div className="text-[11px] text-emerald-300 font-medium">Subuh</div>
            <div className="text-base font-bold font-mono mt-0.5 tabular-nums">{prayerTime.fajr}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50">
            <div className="text-[11px] text-emerald-300 font-medium">Terbit</div>
            <div className="text-base font-bold font-mono mt-0.5 tabular-nums">{prayerTime.sunrise}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50">
            <div className="text-[11px] text-emerald-300 font-medium">Dzuhur</div>
            <div className="text-base font-bold font-mono mt-0.5 tabular-nums">{prayerTime.dhuhr}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50">
            <div className="text-[11px] text-emerald-300 font-medium">Ashar</div>
            <div className="text-base font-bold font-mono mt-0.5 tabular-nums">{prayerTime.asr}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-700/70 border-2 border-emerald-400 font-bold shadow-xs">
            <div className="text-[11px] text-emerald-100 font-semibold flex items-center justify-center gap-1">
              <span>Maghrib</span>
              <span className="text-[9px] bg-emerald-500 px-1 rounded">Aktif</span>
            </div>
            <div className="text-base font-bold font-mono mt-0.5 tabular-nums">{prayerTime.maghrib}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50">
            <div className="text-[11px] text-emerald-300 font-medium">Isya</div>
            <div className="text-base font-bold font-mono mt-0.5 tabular-nums">{prayerTime.isha}</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Content Grid: Live Dakwah Highlight & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Streaming & Featured Dakwah */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Siaran Langsung Dakwah Digital Persyarikatan
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('dakwah')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Studio Dakwah</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <img
                src="/src/assets/images/dakwah_kajian_thumbnail_1792815209813.jpg"
                alt="Tabligh Akbar Majelis Tarjih"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>LIVE TRANSMISSION</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded font-mono tabular-nums">
                14.820 Jemaah Online
              </div>
            </div>

            <div className="p-5 space-y-2">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span>Majelis Tabligh PP Muhammadiyah</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Auditorium Utama & Hybrid Streaming</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Integrasi Nilai Islam Berkemajuan dalam Tata Kelola Ekosistem Digital Nasional
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Narasumber: <strong>Prof. Dr. H. Haedar Nashir, M.Si</strong> (Ketua Umum Pimpinan Pusat Muhammadiyah)
              </p>
              
              <div className="pt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => onNavigateTab('dakwah')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Ikuti Kajian & Beri Pertanyaan
                </button>
                <button
                  onClick={() => onNavigateTab('consultation')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  Tanya Fatwa ke Majelis Tarjih
                </button>
              </div>
            </div>
          </div>

          {/* Transparent Public Transaction Ledger (Transparansi Dana Umat) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.dashboard.recentTransactions}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Audit Terbuka Real-Time dengan Digital Signature SHA-256
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => ExportService.exportTransactionsToCSV(transactions)}
                  className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => onNavigateTab('zakat')}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Buku Besar Penuh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Kode Transaksi</th>
                    <th className="px-4 py-3 font-semibold">Muzakki / Donatur</th>
                    <th className="px-4 py-3 font-semibold">Program</th>
                    <th className="px-4 py-3 font-semibold text-right">Nominal</th>
                    <th className="px-4 py-3 font-semibold">Metode</th>
                    <th className="px-4 py-3 font-semibold text-center">Kwitansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {transactions.slice(0, 5).map(trx => (
                    <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                        {trx.code}
                      </td>
                      <td className="px-4 py-3 text-slate-900 dark:text-white">
                        <div>{trx.donorName}</div>
                        {trx.donorNbm && (
                          <div className="text-[10px] text-slate-400 font-mono">NBM: {trx.donorNbm}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {trx.program}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        Rp {trx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {trx.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onPrintReceipt(trx)}
                          title="Cetak Kwitansi Resmi"
                          className="p-1 rounded text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950 transition-colors"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Upcoming Agenda */}
        <div className="space-y-6">
          
          {/* Quick Action Center */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {t.dashboard.quickActions}
            </h3>

            <button
              onClick={onOpenPaymentModal}
              className="w-full p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>{t.dashboard.payZakat}</span>
              </div>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('wakaf')}
              className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>WakafHub (CWLS & Blockchain)</span>
              </div>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('sima')}
              className="w-full p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{t.dashboard.registerMember}</span>
              </div>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('consultation')}
              className="w-full p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.dashboard.askConsultant}</span>
              </div>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('sima')}
              className="w-full p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Relawan Kemanusiaan (MDMC & Lazismu)</span>
              </div>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Upcoming Persyarikatan Agenda */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {t.dashboard.recentActivities}
              </h3>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {event.hijriDate}
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {event.title}
                  </h5>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {event.gregorianDate} · {event.location}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('calendar')}
              className="w-full py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline text-center"
            >
              Lihat Seluruh Kalender Kegiatan &rarr;
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
