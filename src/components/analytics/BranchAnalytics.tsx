import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Building2,
  Users,
  Award,
  Download,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { BranchPerformance, Language } from '../../types';
import { branchPerformanceData } from '../../data/mockData';
import { translations } from '../../services/i18n';
import { ExportService } from '../../services/exportService';

interface BranchAnalyticsProps {
  language: Language;
}

export const BranchAnalytics: React.FC<BranchAnalyticsProps> = ({ language }) => {
  const t = translations[language];
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'30d' | 'quarter' | 'ytd'>('ytd');

  const branches = branchPerformanceData;

  const filteredBranches = branches.filter(b => {
    return selectedProvince === 'all' || b.province === selectedProvince;
  });

  const totalMembersFiltered = filteredBranches.reduce((s, b) => s + b.totalMembers, 0);
  const totalActivitiesFiltered = filteredBranches.reduce((s, b) => s + b.activeActivitiesCount, 0);
  const totalZakatFiltered = filteredBranches.reduce((s, b) => s + b.zakatCollectedYTD, 0);
  const avgPerformance = (
    filteredBranches.reduce((s, b) => s + b.performanceScore, 0) / (filteredBranches.length || 1)
  ).toFixed(1);

  const handleExportCSV = () => {
    const flat = filteredBranches.map(b => ({
      'Kode': b.code,
      'Nama Cabang / Wilayah': b.name,
      'Provinsi': b.province,
      'Total Anggota': b.totalMembers,
      'Kegiatan Aktif': b.activeActivitiesCount,
      'ZISWAF Terealisasi (IDR)': b.zakatCollectedYTD,
      'Tingkat Kehadiran (%)': b.attendanceRate,
      'Skor Kinerja': b.performanceScore,
      'Predikat': b.status,
    }));
    ExportService.exportToExcel(flat, 'Analitik_Kinerja_Cabang_Muhammadiyah');
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.analytics.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.analytics.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Province Filter */}
          <select
            value={selectedProvince}
            onChange={e => setSelectedProvince(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
          >
            <option value="all">{t.analytics.allProvinces}</option>
            <option value="DI Yogyakarta">DI Yogyakarta</option>
            <option value="Jawa Tengah">Jawa Tengah</option>
            <option value="Jawa Timur">Jawa Timur</option>
            <option value="DKI Jakarta">DKI Jakarta</option>
            <option value="Jawa Barat">Jawa Barat</option>
            <option value="Sumatera Barat">Sumatera Barat</option>
            <option value="Sulawesi Selatan">Sulawesi Selatan</option>
            <option value="Kalimantan Selatan">Kalimantan Selatan</option>
          </select>

          {/* Time range selector */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                timeRange === '30d' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                timeRange === 'quarter' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Triwulan
            </button>
            <button
              onClick={() => setTimeRange('ytd')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                timeRange === 'ytd' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Tahun 2026
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan Excel</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Anggota Terpantau</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {totalMembersFiltered.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Terverifikasi NBM</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kegiatan Aktif Berjalan</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {totalActivitiesFiltered.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Kajian, Sosial, MDMC</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Realisasi ZISWAF</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
            Rp {(totalZakatFiltered / 1000000000).toFixed(1)} M
          </div>
          <div className="text-[11px] text-slate-500 mt-1">LAZISMU Terverifikasi</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rerata Indeks Keunggulan</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {avgPerformance} / 100
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Status Sangat Unggul</div>
        </div>
      </div>

      {/* Visual Analytics Grid: Heatmap Bar Chart (Left 7 Cols) & Excellence Ranking (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Activity and Zakat Realization Distribution */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Distribusi Partisipasi & Realisasi ZISWAF Antar Wilayah
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Data real-time disinkronkan dari server cloud SIMA & Lazismu
              </span>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-4">
            {filteredBranches.map(branch => {
              const maxZakat = 138000000000;
              const widthPct = Math.min(100, Math.round((branch.zakatCollectedYTD / maxZakat) * 100));

              return (
                <div key={branch.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{branch.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[11px]">{branch.activeActivitiesCount} kegiatan</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        Rp {(branch.zakatCollectedYTD / 1000000000).toFixed(1)} M
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Branch Ranking & Excellence Matrix */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.analytics.branchRanking}
            </h3>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {filteredBranches
              .sort((a, b) => b.performanceScore - a.performanceScore)
              .map((b, idx) => (
                <div
                  key={b.id}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-500">Kehadiran: {b.attendanceRate}%</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-slate-900 dark:text-white tabular-nums">
                      {b.performanceScore}
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
            <strong>Penilaian Cabang Unggul:</strong> Ditentukan dari 4 pilar utama: Keaktifan Ranting, Akuntabilitas Dana LAZISMU, Frekuensi Pengajian Rutin, dan Jumlah Kader Baru.
          </div>
        </div>

      </div>

    </div>
  );
};
