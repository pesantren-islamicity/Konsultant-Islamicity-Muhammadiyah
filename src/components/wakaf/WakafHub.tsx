import React, { useState, useMemo } from 'react';
import {
  Coins,
  Building2,
  Cpu,
  FileCheck,
  ShieldCheck,
  Search,
  Download,
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Users,
  Activity,
  Layers,
  Sparkles,
  Printer,
  ChevronRight,
  Calculator,
  ArrowUpRight,
  Database,
  RefreshCw,
  QrCode,
  Calendar,
  Lock
} from 'lucide-react';
import {
  CashWaqfProgram,
  ProductiveWaqfAsset,
  WaqfBlockchainTransaction,
  WaqfBlockchainBlock,
  WaqfPledgeRecord,
  Language
} from '../../types';
import { WaqfDonationModal } from './WaqfDonationModal';
import { ExportService } from '../../services/exportService';

interface WakafHubProps {
  programs: CashWaqfProgram[];
  productiveAssets: ProductiveWaqfAsset[];
  blockchainTransactions: WaqfBlockchainTransaction[];
  blockchainBlocks: WaqfBlockchainBlock[];
  pledges: WaqfPledgeRecord[];
  onAddPledge: (pledge: WaqfPledgeRecord) => void;
  onNavigateTab: (tab: string) => void;
  language: Language;
}

export const WakafHub: React.FC<WakafHubProps> = ({
  programs,
  productiveAssets,
  blockchainTransactions,
  blockchainBlocks,
  pledges,
  onAddPledge,
  onNavigateTab,
  language
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tunai' | 'produktif' | 'blockchain' | 'sertifikat'>('tunai');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProgramForDonation, setSelectedProgramForDonation] = useState<CashWaqfProgram | null>(null);
  const [selectedTxDetail, setSelectedTxDetail] = useState<WaqfBlockchainTransaction | null>(null);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<ProductiveWaqfAsset | null>(null);

  // Cash Waqf Linked Sukuk (CWLS) Calculator State
  const [cwlsNominal, setCwlsNominal] = useState<number>(5000000);
  const [cwlsTenure, setCwlsTenure] = useState<number>(5);

  // Calculate high-level summary KPIs
  const totalValuation = useMemo(() => {
    return productiveAssets.reduce((acc, a) => acc + a.valuationAmount, 0);
  }, [productiveAssets]);

  const totalCollectedCash = useMemo(() => {
    return programs.reduce((acc, p) => acc + p.collectedAmount, 0);
  }, [programs]);

  const totalAnnualYield = useMemo(() => {
    return productiveAssets.reduce((acc, a) => acc + a.annualNetYield, 0);
  }, [productiveAssets]);

  const totalBeneficiaries = useMemo(() => {
    return productiveAssets.reduce((acc, a) => acc + a.beneficiariesServed, 0);
  }, [productiveAssets]);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [programs, searchQuery, categoryFilter]);

  // Filtered Productive Assets
  const filteredAssets = useMemo(() => {
    return productiveAssets.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.branchPwm.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [productiveAssets, searchQuery, categoryFilter]);

  // Filtered Blockchain Transactions
  const filteredTx = useMemo(() => {
    return blockchainTransactions.filter(tx => {
      return tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.wakifName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.programTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.blockNumber.toString().includes(searchQuery);
    });
  }, [blockchainTransactions, searchQuery]);

  // CWLS Simulation results
  const simulatedYieldPerYear = Math.round(cwlsNominal * 0.065); // 6.5% gross coupon
  const estimatedStudentsFunded = Math.floor(simulatedYieldPerYear / 1500000); // Rp 1.5M per student aid

  return (
    <div className="space-y-6">

      {/* Top Banner Hero & Integrated Zakat Crosslink */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
              WakafHub Berkemajuan · M-Chain
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-950/60 border border-emerald-700/50 text-emerald-300">
              Blockchain Block #1,408,315 · 38 Nodes Synchronized
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Infrastruktur Wakaf Digital & Buku Besar Transparansi Blockchain
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Menghubungkan ekosistem ZISWAF kaffah dengan instrumen Wakaf Uang (CWLS Ritel), pendayagunaan Aset Produktif (Rumah Sakit PKU, Universitas, Surya Mart, Agribisnis), dan akuntabilitas audit mutlak berbasis smart contract nir-biaya gas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveSubTab('tunai');
                if (programs.length > 0) setSelectedProgramForDonation(programs[0]);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all"
            >
              <Coins className="w-4 h-4 text-emerald-700" />
              <span>Tunaikan Wakaf Uang (CWLS)</span>
            </button>

            <button
              onClick={() => onNavigateTab('zakat')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 text-white border border-emerald-600/50 font-medium text-xs transition-all"
            >
              <span>Sinergi Kalkulator Zakat</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            <button
              onClick={() => ExportService.exportWaqfTransactionsToCSV(blockchainTransactions)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-200 border border-emerald-700/40 font-medium text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Ledger Blockchain (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 National High-Level Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Valuasi Aset Produktif</span>
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
            Rp {(totalValuation / 1000000000000).toFixed(2)} Triliun
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Tersebar di 38 PWM Se-Indonesia
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Realisasi Wakaf Tunai (CWLS)</span>
            <Coins className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
            Rp {(totalCollectedCash / 1000000000).toFixed(2)} Miliar
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            22.110+ Wakif Aktif Terverifikasi
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Surplus Bersih Manfaat (Yield)</span>
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            Rp {(totalAnnualYield / 1000000000).toFixed(1)} Miliar / Th
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Rerata Imbal Hasil Portofolio 8.6%
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Mauquf 'Alaih Terbantu</span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
            {totalBeneficiaries.toLocaleString('id-ID')} Jiwa / Th
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Pasien Dhuafa, Santri, Guru Honorer
          </div>
        </div>
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'tunai', label: 'Wakaf Tunai & CWLS', icon: Coins, count: programs.length },
            { id: 'produktif', label: 'Aset Wakaf Produktif', icon: Building2, count: productiveAssets.length },
            { id: 'blockchain', label: 'Transparansi Blockchain', icon: Cpu, count: blockchainTransactions.length },
            { id: 'sertifikat', label: 'Akta Ikrar & Sertifikat Saya', icon: FileCheck, count: pledges.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id as any);
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs dark:bg-emerald-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-emerald-800/80 text-emerald-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Search Bar within WakafHub */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'tunai' ? 'Cari program wakaf uang...' :
              activeSubTab === 'produktif' ? 'Cari aset RS PKU, kampus...' :
              'Cari TxHash, wakif, block...'
            }
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Sub-Tab 1: Wakaf Tunai & CWLS */}
      {activeSubTab === 'tunai' && (
        <div className="space-y-6">
          
          {/* CWLS Interactive Simulation Calculator */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Calculator className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Simulator Cash Waqf Linked Sukuk (CWLS Ritel)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Hitung proyeksi imbalan kupon wakaf berjangka yang disalurkan 100% untuk membiayai dhuafa secara otomatis.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Tenor:</span>
                {[3, 5, 10].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setCwlsTenure(yr)}
                    className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors ${
                      cwlsTenure === yr
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {yr} Tahun
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Nominal Rencana Wakaf Uang
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[1000000, 5000000, 10000000, 25000000].map(n => (
                    <button
                      key={n}
                      onClick={() => setCwlsNominal(n)}
                      className={`px-2 py-1 rounded text-[11px] font-mono font-medium ${
                        cwlsNominal === n
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Rp {(n / 1000000)} Jt
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="500000"
                  max="100000000"
                  step="500000"
                  value={cwlsNominal}
                  onChange={e => setCwlsNominal(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600"
                />
                <div className="text-right text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                  Rp {cwlsNominal.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Simulation Output Card 1 */}
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl">
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                  Imbal Hasil Kupon Wakaf / Tahun (6.5%)
                </div>
                <div className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300 my-1">
                  Rp {simulatedYieldPerYear.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                  Total {cwlsTenure} Tahun: Rp {(simulatedYieldPerYear * cwlsTenure).toLocaleString('id-ID')}
                </div>
              </div>

              {/* Simulation Output Card 2 */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl">
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                  Dampak Nyata Kemaslahatan
                </div>
                <div className="text-xl font-black font-mono text-slate-900 dark:text-white my-1">
                  {estimatedStudentsFunded || 1} Santri Dhuafa
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Mendapatkan beasiswa penuh biaya pendidikan + Pokok 100% kembali saat jatuh tempo.
                </div>
              </div>
            </div>
          </div>

          {/* Program Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrograms.map(program => {
              const progressPct = Math.min(100, Math.round((program.collectedAmount / program.targetAmount) * 100));
              return (
                <div
                  key={program.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {program.code}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {program.tenureType === 'abadi' ? 'Wakaf Abadi' : `CWLS ${program.tenureYears} Th`}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                      {program.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500">Terkumpul:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          Rp {(program.collectedAmount / 1000000000).toFixed(2)} M ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Target: Rp {(program.targetAmount / 1000000000).toFixed(1)} M</span>
                        <span>{program.wakifCount.toLocaleString('id-ID')} Wakif</span>
                      </div>
                    </div>

                    {/* Mauquf Alaih Callout */}
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>Mauquf 'Alaih:</strong> {program.mauqufAlaih}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-slate-500 truncate max-w-[140px]" title={program.blockchainContract}>
                      SC: {program.blockchainContract.slice(0, 10)}...
                    </div>
                    <button
                      onClick={() => setSelectedProgramForDonation(program)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Tunaikan Wakaf</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Aset Wakaf Produktif */}
      {activeSubTab === 'produktif' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Filter Kategori Aset:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              >
                <option value="all">Semua Kategori ({productiveAssets.length})</option>
                <option value="Kesehatan (RS PKU)">Rumah Sakit PKU</option>
                <option value="Pendidikan (Universitas/Pesantren)">Universitas / Pendidikan</option>
                <option value="Ritel & Komersial">Ritel Surya Mart & Komersial</option>
                <option value="Agribisnis & Perkebunan">Agribisnis & Perkebunan</option>
                <option value="Gedung Dakwah & AUM">Gedung Dakwah & Menara</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => ExportService.exportProductiveWaqfAssetsToCSV(productiveAssets)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Portofolio Aset (CSV)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {asset.assetCode}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {asset.branchPwm}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {asset.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {asset.location}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {asset.status}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-500">Nilai Wajar Aset:</span>
                    <div className="text-xs font-black font-mono text-slate-900 dark:text-white mt-0.5">
                      Rp {(asset.valuationAmount / 1000000000).toFixed(1)} Miliar
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Surplus Bersih (Yield):</span>
                    <div className="text-xs font-black font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                      Rp {(asset.annualNetYield / 1000000000).toFixed(1)} M ({asset.yieldPercentage}%)
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Penerima Manfaat:</span>
                    <div className="text-xs font-black font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {asset.beneficiariesServed.toLocaleString('id-ID')} Jiwa/Th
                    </div>
                  </div>
                </div>

                {/* Nazhir & Blockchain Hash Row */}
                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Nazhir Penanggung Jawab:</span>
                    <span className="font-semibold text-right">{asset.nazhirName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">No. Registrasi BWI:</span>
                    <span className="font-mono text-[11px] text-slate-500">{asset.nazhirRegistrationNo}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Block #{asset.blockchainRecord.blockNumber} Validated</span>
                    </div>
                    <button
                      onClick={() => setSelectedAssetDetail(asset)}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Lihat Bukti On-Chain</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Transparansi Blockchain Explorer */}
      {activeSubTab === 'blockchain' && (
        <div className="space-y-6">
          
          {/* Consortium Nodes Status Grid */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Konsorsium Jaringan M-Chain (Proof-of-Integrity Sharia Consensus)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    38 Node Validator PWM se-Indonesia + Dewan Syariah Majelis Tarjih PP Muhammadiyah
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Network Healthy
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">Gas: 0 Gwei</span>
              </div>
            </div>

            {/* Validator Nodes Sample Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'PWM DI Yogyakarta', role: 'Master Node & Tarjih Audit', height: 1408315, ping: '12ms' },
                { name: 'PWM Jawa Timur', role: 'Validator Node Surabaya', height: 1408315, ping: '18ms' },
                { name: 'PWM Jawa Tengah', role: 'Validator Node Solo Edutorium', height: 1408315, ping: '15ms' },
                { name: 'PWM DKI Jakarta', role: 'Validator Node Menteng Tower', height: 1408315, ping: '10ms' },
              ].map((node, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{node.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{node.role}</div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-emerald-700 dark:text-emerald-400 pt-1">
                    <span>#{node.height}</span>
                    <span>{node.ping}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Explorer Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Buku Besar Transaksi Terkini (Live Blockchain Ledger)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Semua transaksi wakaf uang, penambahan aset, dan distribusi dividen tercatat kekal tanpa bisa diubah.
                </p>
              </div>

              <button
                onClick={() => ExportService.exportWaqfTransactionsToCSV(blockchainTransactions)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Ledger (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tx Hash & Waktu</th>
                    <th className="py-3 px-4">Block #</th>
                    <th className="py-3 px-4">Wakif / Entitas</th>
                    <th className="py-3 px-4">Program / Penyaluran</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredTx.map(tx => (
                    <tr key={tx.txHash} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[140px]" title={tx.txHash}>
                          {tx.txHash.slice(0, 14)}...
                        </div>
                        <div className="text-[10px] text-slate-400">{tx.timestamp}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        #{tx.blockNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{tx.wakifName}</div>
                        {tx.wakifNbm && (
                          <div className="text-[10px] font-mono text-slate-400">NBM: {tx.wakifNbm}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="truncate font-medium text-slate-800 dark:text-slate-200">{tx.programTitle}</div>
                        <div className="text-[10px] text-slate-400 truncate">{tx.mauqufAlaihDistribution}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white tabular-nums">
                        Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedTxDetail(tx)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 hover:text-emerald-700 text-[11px] font-medium transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Akta Ikrar & Sertifikat Saya */}
      {activeSubTab === 'sertifikat' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Daftar Sertifikat Wakaf Uang (SWU) & Akta Ikrar Wakaf (AIW) Digital
                </h4>
                <p className="text-xs text-slate-500">
                  Dokumen legal syariah ber-QR code dan hash verifikasi blockchain resmi Pimpinan Pusat Muhammadiyah.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveSubTab('tunai');
                  if (programs.length > 0) setSelectedProgramForDonation(programs[0]);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              >
                <Coins className="w-4 h-4" />
                <span>Tunaikan Wakaf Baru</span>
              </button>
            </div>

            {pledges.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <FileCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  Belum Ada Sertifikat Wakaf di Sesi Ini
                </h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Pilih program wakaf uang pada katalog dan tunaikan wakaf Anda untuk langsung menerbitkan Sertifikat Wakaf Tunai (SWU) resmi secara instan.
                </p>
                <button
                  onClick={() => {
                    setActiveSubTab('tunai');
                    if (programs.length > 0) setSelectedProgramForDonation(programs[0]);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
                >
                  Jelajahi Program Wakaf Tunai
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pledges.map(pledge => (
                  <div
                    key={pledge.id}
                    className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {pledge.certificateNumber}
                        </span>
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                          {pledge.programTitle}
                        </h5>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {pledge.tenureType === 'abadi' ? 'Abadi' : `Berjangka ${pledge.tenureYears} Th`}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wakif:</span>
                        <span className="font-semibold">{pledge.wakifName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nominal Wakaf:</span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          Rp {pledge.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tanggal:</span>
                        <span>{pledge.timestamp}</span>
                      </div>
                    </div>

                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 truncate">
                      Tx: {pledge.txHash} (Block #{pledge.blockNumber})
                    </div>

                    <button
                      onClick={() => ExportService.printWaqfCertificatePDF(pledge)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Sertifikat Wakaf (PDF)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Tunaikan Wakaf & Minting */}
      {selectedProgramForDonation && (
        <WaqfDonationModal
          isOpen={!!selectedProgramForDonation}
          onClose={() => setSelectedProgramForDonation(null)}
          program={selectedProgramForDonation}
          onSuccess={newPledge => {
            onAddPledge(newPledge);
          }}
          language={language}
        />
      )}

      {/* Modal: Inspection of Blockchain Transaction Detail */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Detail Transaksi Sharia M-Chain
                </h4>
              </div>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 font-mono text-[11px]">
                <div className="text-slate-400 text-[10px]">TRANSACTION HASH:</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold break-all">
                  {selectedTxDetail.txHash}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-400">Block Height</span>
                  <div className="font-mono font-bold text-sm">#{selectedTxDetail.blockNumber}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-400">Gas Fee Protocol</span>
                  <div className="font-mono font-bold text-sm text-emerald-600">{selectedTxDetail.gasFee}</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Wakif:</span>
                  <span className="font-bold">{selectedTxDetail.wakifName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Program:</span>
                  <span className="font-semibold text-right max-w-xs">{selectedTxDetail.programTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nominal:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    Rp {selectedTxDetail.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Waktu Validasi:</span>
                  <span>{selectedTxDetail.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nazhir Signer:</span>
                  <span className="font-mono text-[11px] text-slate-500">{selectedTxDetail.nazhirSigner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alokasi Manfaat:</span>
                  <span className="font-medium text-right text-indigo-600 dark:text-indigo-400">
                    {selectedTxDetail.mauqufAlaihDistribution}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxDetail(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Selesai Memeriksa
            </button>
          </div>
        </div>
      )}

      {/* Modal: Inspection of Productive Asset On-Chain Record */}
      {selectedAssetDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Sertifikat On-Chain Aset: {selectedAssetDetail.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedAssetDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-1">
                <div className="text-[10px] text-emerald-700 font-semibold">KODE VERIFIKASI ASET BLOCKCHAIN:</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {selectedAssetDetail.blockchainRecord.qrHash}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Tx: {selectedAssetDetail.blockchainRecord.txHash}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-400">Nilai Wajar Aset</span>
                  <div className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                    Rp {selectedAssetDetail.valuationAmount.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-400">Surplus Bersih Tahunan (Yield)</span>
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    Rp {selectedAssetDetail.annualNetYield.toLocaleString('id-ID')} ({selectedAssetDetail.yieldPercentage}%)
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Luas Tanah & Bangunan:</span>
                  <span className="font-medium">{selectedAssetDetail.landAreaM2.toLocaleString('id-ID')} m² / {selectedAssetDetail.buildingAreaM2.toLocaleString('id-ID')} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wilayah PWM:</span>
                  <span className="font-medium">{selectedAssetDetail.branchPwm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">No. Registrasi BWI:</span>
                  <span className="font-mono">{selectedAssetDetail.nazhirRegistrationNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Merkle Root:</span>
                  <span className="font-mono text-slate-500 truncate max-w-xs">{selectedAssetDetail.blockchainRecord.merkleRoot}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedAssetDetail(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Tutup Rincian Aset
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
