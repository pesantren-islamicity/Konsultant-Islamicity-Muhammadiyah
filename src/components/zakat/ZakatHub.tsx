import React, { useState } from 'react';
import {
  Coins,
  Calculator,
  Receipt,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Building,
  HeartHandshake,
  Sparkles,
  AlertCircle,
  Scale,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { ZakatTransaction, Language } from '../../types';
import { translations } from '../../services/i18n';
import { ExportService } from '../../services/exportService';

interface ZakatHubProps {
  transactions: ZakatTransaction[];
  onOpenPaymentModal: (program?: string, amount?: number) => void;
  onPrintReceipt: (trx: ZakatTransaction) => void;
  language: Language;
  onNavigateTab?: (tab: string) => void;
}

export const ZakatHub: React.FC<ZakatHubProps> = ({
  transactions,
  onOpenPaymentModal,
  onPrintReceipt,
  language,
  onNavigateTab,
}) => {
  const t = translations[language];

  // Calculator State - Supports Unified 'kombinasi' (Penghasilan & Emas), profesi, maal, fitrah, perniagaan
  const [calcType, setCalcType] = useState<'kombinasi' | 'profesi' | 'maal' | 'fitrah' | 'perniagaan'>('kombinasi');
  
  // Emas & Maal inputs
  const [savingsWealth, setSavingsWealth] = useState<number>(150000000);
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(90);
  const [goldHasHaul, setGoldHasHaul] = useState<boolean>(true);
  
  // Profesi / Penghasilan inputs
  const [monthlyIncome, setMonthlyIncome] = useState<number>(16000000);
  const [monthlyBonus, setMonthlyBonus] = useState<number>(2000000);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(5000000);
  
  // Fitrah inputs
  const [fitrahSouls, setFitrahSouls] = useState<number>(4);
  const [fitrahPricePerSoul, setFitrahPricePerSoul] = useState<number>(45000);

  // Perniagaan inputs
  const [businessAssets, setBusinessAssets] = useState<number>(300000000);
  const [businessDebts, setBusinessDebts] = useState<number>(80000000);

  // Constants (Berdasarkan Fatwa Majelis Tarjih PP Muhammadiyah & Standar BWI)
  const goldPricePerGram = 1450000; // Rp 1.450.000 / gram (Antam/Benchmark)
  const nisabGold85g = 85 * goldPricePerGram; // Rp 123.250.000
  const nisabMonthlyIncome = nisabGold85g / 12; // ~Rp 10.270.833 / bulan

  // Detailed calculations
  const totalGrossIncome = monthlyIncome + monthlyBonus;
  const netMonthlyIncome = Math.max(0, totalGrossIncome - monthlyExpense);
  const isProfesiObligated = netMonthlyIncome >= nisabMonthlyIncome;
  const zakatProfesiAmount = isProfesiObligated ? Math.round(netMonthlyIncome * 0.025) : 0;
  const profesiProgressPct = Math.min(100, Math.round((netMonthlyIncome / nisabMonthlyIncome) * 100));

  const goldTotalValue = goldWeightGrams * goldPricePerGram;
  const isGoldObligated = goldWeightGrams >= 85 && goldHasHaul;
  const zakatGoldAmount = isGoldObligated ? Math.round(goldTotalValue * 0.025) : 0;
  const goldProgressPct = Math.min(100, Math.round((goldWeightGrams / 85) * 100));

  // Dynamic selection calculation
  let isObligated = false;
  let calculatedZakat = 0;
  let zakatModalTitle = 'Zakat Profesi & Emas';

  if (calcType === 'kombinasi') {
    isObligated = isProfesiObligated || isGoldObligated;
    calculatedZakat = zakatProfesiAmount + zakatGoldAmount;
    zakatModalTitle = isProfesiObligated && isGoldObligated ? 'Zakat Profesi & Emas' : isProfesiObligated ? 'Zakat Profesi' : 'Zakat Emas (Maal)';
  } else if (calcType === 'profesi') {
    isObligated = isProfesiObligated;
    calculatedZakat = zakatProfesiAmount;
    zakatModalTitle = 'Zakat Profesi';
  } else if (calcType === 'maal') {
    const totalMaal = savingsWealth + goldTotalValue;
    isObligated = totalMaal >= nisabGold85g && goldHasHaul;
    calculatedZakat = isObligated ? Math.round(totalMaal * 0.025) : 0;
    zakatModalTitle = 'Zakat Maal (Tabungan & Emas)';
  } else if (calcType === 'fitrah') {
    isObligated = true;
    calculatedZakat = fitrahSouls * fitrahPricePerSoul;
    zakatModalTitle = 'Zakat Fitrah';
  } else if (calcType === 'perniagaan') {
    const netBusiness = Math.max(0, businessAssets - businessDebts);
    isObligated = netBusiness >= nisabGold85g;
    calculatedZakat = isObligated ? Math.round(netBusiness * 0.025) : 0;
    zakatModalTitle = 'Zakat Perniagaan';
  }

  // Transactions table filters
  const [trxSearch, setTrxSearch] = useState<string>('');
  const [trxProgramFilter, setTrxProgramFilter] = useState<string>('all');
  const [sheetsCopied, setSheetsCopied] = useState(false);

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.donorName.toLowerCase().includes(trxSearch.toLowerCase()) ||
                        t.code.toLowerCase().includes(trxSearch.toLowerCase()) ||
                        t.branch.toLowerCase().includes(trxSearch.toLowerCase());
    const matchProgram = trxProgramFilter === 'all' || t.program === trxProgramFilter;
    return matchSearch && matchProgram;
  });

  const totalCollected = transactions.reduce((sum, t) => sum + t.amount, 0);

  const handleCopySheets = () => {
    ExportService.copyToGoogleSheetsFormat(transactions);
    setSheetsCopied(true);
    setTimeout(() => setSheetsCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.zakat.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kalkulator Terverifikasi Majelis Tarjih, Integrasi Gateway Pembayaran Multi-Channel & Audit Buku Besar Terbuka
          </p>
        </div>

        <button
          onClick={() => onOpenPaymentModal('Zakat Maal', calculatedZakat > 0 ? calculatedZakat : 1000000)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Coins className="w-4 h-4" />
          <span>Tunaikan Donasi / Zakat Digital</span>
        </button>
      </div>

      {/* Sinergi Zakat & Wakaf Banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                Sinergi Zakat & Wakaf Kaffah
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                M-Chain Blockchain Verified
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
              Ingin Mengalirkan Pahala Jariyah Abadi? Tunaikan Wakaf Uang (CWLS) & Aset Produktif
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Hasil surplus wakaf produktif (RS PKU, Universitas, Surya Mart) menyokong dana mustahik secara berkesinambungan.
            </p>
          </div>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('wakaf')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            <span>Buka WakafHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Grid: Zakat Calculator (Left) & Asnaf Distribution Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Zakat Calculator (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
          
          {/* Header & Live Gold Benchmark */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.zakat.calculator}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Perhitungan Otomatis Nisab Majelis Tarjih PP Muhammadiyah
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-lg">
              <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <div className="text-[11px] font-mono">
                <span className="text-slate-500 dark:text-slate-400">Emas Antam: </span>
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  Rp {goldPricePerGram.toLocaleString('id-ID')}/gr
                </span>
              </div>
            </div>
          </div>

          {/* Calculator Mode Selection Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setCalcType('kombinasi')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
                calcType === 'kombinasi'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>Penghasilan & Emas</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                calcType === 'kombinasi' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                Interaktif
              </span>
            </button>

            <button
              onClick={() => setCalcType('profesi')}
              className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                calcType === 'profesi'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Profesi / Gaji
            </button>

            <button
              onClick={() => setCalcType('maal')}
              className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                calcType === 'maal'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Zakat Maal & Emas
            </button>

            <button
              onClick={() => setCalcType('fitrah')}
              className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                calcType === 'fitrah'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Zakat Fitrah
            </button>

            <button
              onClick={() => setCalcType('perniagaan')}
              className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                calcType === 'perniagaan'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Perniagaan
            </button>
          </div>

          {/* Quick Simulation Presets (Active in Kombinasi Mode) */}
          {calcType === 'kombinasi' && (
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-emerald-600" />
                  Preset Cepat Simulasi:
                </span>
                <span className="text-[10px] font-mono">1-Klik Input</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Eksekutif: Gaji 25jt + Emas 95g', inc: 25000000, bon: 5000000, exp: 8000000, gold: 95, haul: true },
                  { label: 'Karyawan: Gaji 16jt + Emas 30g', inc: 16000000, bon: 1000000, exp: 5000000, gold: 30, haul: true },
                  { label: 'Tabungan Emas: Gaji 8jt + Emas 120g', inc: 8000000, bon: 0, exp: 3500000, gold: 120, haul: true },
                  { label: 'Di Bawah Nisab: Gaji 7jt + Emas 15g', inc: 7000000, bon: 0, exp: 3000000, gold: 15, haul: true },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMonthlyIncome(preset.inc);
                      setMonthlyBonus(preset.bon);
                      setMonthlyExpense(preset.exp);
                      setGoldWeightGrams(preset.gold);
                      setGoldHasHaul(preset.haul);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC CALCULATOR SECTIONS */}
          <div className="space-y-6">
            
            {/* ---------------- SECTION A: PENGHASILAN BULANAN (Kombinasi or Profesi) ---------------- */}
            {(calcType === 'kombinasi' || calcType === 'profesi') && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Penghasilan Bulanan & Zakat Profesi
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Kadar Wajib: 2.5%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Monthly Base Income */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Gaji Pokok & Tunjangan Bulanan
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                      <input
                        type="number"
                        step="500000"
                        value={monthlyIncome}
                        onChange={e => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40000000"
                      step="500000"
                      value={monthlyIncome}
                      onChange={e => setMonthlyIncome(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Monthly Expenses */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Pengeluaran Kebutuhan Pokok (Pangan, Cicilan Rumah, dll)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                      <input
                        type="number"
                        step="500000"
                        value={monthlyExpense}
                        onChange={e => setMonthlyExpense(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20000000"
                      step="500000"
                      value={monthlyExpense}
                      onChange={e => setMonthlyExpense(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Optional Bonus input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bonus, Tunjangan Kinerja, atau Pendapatan Tambahan Lainnya (Bulan Ini)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                    <input
                      type="number"
                      step="500000"
                      value={monthlyBonus}
                      onChange={e => setMonthlyBonus(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-9 pr-3 py-1.5 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                    />
                  </div>
                </div>

                {/* Income Nisab Indicator Card */}
                <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Penghasilan Bersih Bulanan: </span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        Rp {netMonthlyIncome.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Nisab Bulanan: </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        Rp {Math.round(nisabMonthlyIncome).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">(85g Emas / 12)</span>
                    </div>
                  </div>

                  {/* Progress Bar towards Income Nisab */}
                  <div className="space-y-1">
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isProfesiObligated ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${profesiProgressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-mono text-slate-500">{profesiProgressPct}% dari Ambang Batas Nisab</span>
                      {isProfesiObligated ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Telah Memenuhi Nisab (Wajib Zakat Rp {zakatProfesiAmount.toLocaleString('id-ID')}/bln)</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Kurang Rp {Math.round(Math.max(0, nisabMonthlyIncome - netMonthlyIncome)).toLocaleString('id-ID')} untuk mencapai nisab</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- SECTION B: ASET EMAS & LOGAM MULIA (Kombinasi or Maal) ---------------- */}
            {(calcType === 'kombinasi' || calcType === 'maal') && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                      {calcType === 'kombinasi' ? '2' : '1'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Aset Simpanan Emas & Logam Mulia
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-semibold bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                    Nisab: 85 Gram Emas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gold Weight Grams */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah Emas Murni Tersimpan (Gram)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={goldWeightGrams}
                        onChange={e => setGoldWeightGrams(Math.max(0, Number(e.target.value)))}
                        className="w-full pr-14 pl-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                        placeholder="Contoh: 90 gram"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">gram</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="1"
                      value={goldWeightGrams}
                      onChange={e => setGoldWeightGrams(Number(e.target.value))}
                      className="w-full mt-2 accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Live Rupiah Equivalent */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Konversi Nilai Pasar Real-Time (Antam Rp {goldPricePerGram.toLocaleString('id-ID')}/gr)
                    </label>
                    <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
                      <div className="text-sm font-bold font-mono text-amber-900 dark:text-amber-200">
                        Rp {goldTotalValue.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {goldWeightGrams} gram × Rp {goldPricePerGram.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Tabungan / Savings if in Maal Tab */}
                {calcType === 'maal' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Saldo Tabungan & Deposito Tersimpan Lainnya (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                      <input
                        type="number"
                        step="1000000"
                        value={savingsWealth}
                        onChange={e => setSavingsWealth(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Haul Checkbox Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="haulCheck"
                      checked={goldHasHaul}
                      onChange={e => setGoldHasHaul(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                    />
                    <label htmlFor="haulCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Aset telah tersimpan mencapai 1 Tahun Hijriyah / Haul Penuh
                    </label>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    goldHasHaul ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {goldHasHaul ? 'Haul Terpenuhi' : 'Belum 1 Tahun'}
                  </span>
                </div>

                {/* Gold Nisab Indicator Card */}
                <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Total Simpanan Emas: </span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        {goldWeightGrams} Gram
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Nisab Emas Maal: </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        85 Gram
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">(Rp {nisabGold85g.toLocaleString('id-ID')})</span>
                    </div>
                  </div>

                  {/* Progress Bar towards Gold Nisab */}
                  <div className="space-y-1">
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isGoldObligated ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${goldProgressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-mono text-slate-500">{goldProgressPct}% dari 85 Gram</span>
                      {isGoldObligated ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Wajib Zakat Emas 2.5%: Rp {zakatGoldAmount.toLocaleString('id-ID')} ({(goldWeightGrams * 0.025).toFixed(2)} gr)</span>
                        </span>
                      ) : !goldHasHaul ? (
                        <span className="text-amber-600 font-semibold">Belum Wajib Zakat (Syarat Haul 1 tahun belum tercapai)</span>
                      ) : (
                        <span className="text-slate-500 font-medium">Kurang {Math.max(0, 85 - goldWeightGrams)} gram lagi untuk mencapai nisab</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- SECTION C: FITRAH (If Fitrah active) ---------------- */}
            {calcType === 'fitrah' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah Tanggungan Jiwa
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={fitrahSouls}
                      onChange={e => setFitrahSouls(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tarif per Jiwa (Beras / Uang)
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={fitrahPricePerSoul}
                      onChange={e => setFitrahPricePerSoul(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Setara 2.5 kg atau 3.5 liter beras per jiwa sesuai edaran resmi Lazismu dan Majelis Tarjih PP Muhammadiyah.
                </div>
              </div>
            )}

            {/* ---------------- SECTION D: PERNIAGAAN (If Perniagaan active) ---------------- */}
            {calcType === 'perniagaan' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nilai Barang Dagangan / Persediaan + Piutang Lancar
                  </label>
                  <input
                    type="number"
                    step="1000000"
                    value={businessAssets}
                    onChange={e => setBusinessAssets(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Utang Jatuh Tempo Usaha yang Harus Dibayar
                  </label>
                  <input
                    type="number"
                    step="1000000"
                    value={businessDebts}
                    onChange={e => setBusinessDebts(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
              </div>
            )}

          </div>

          {/* ITEMIZATION BREAKDOWN & PROMINENT CALL TO ACTION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                  Ringkasan & Total Kewajiban Zakat Otomatis
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-300">
                {isObligated ? 'Status: Wajib Ditunaikan' : 'Status: Belum Wajib Nisab'}
              </span>
            </div>

            {/* Itemized Line Items when in Kombinasi Mode */}
            {calcType === 'kombinasi' && (
              <div className="space-y-1.5 text-xs text-slate-300 border-b border-emerald-900/80 pb-3">
                <div className="flex justify-between items-center">
                  <span>1. Zakat Profesi (Penghasilan Bersih Bulanan):</span>
                  <span className="font-mono font-bold text-white">
                    Rp {zakatProfesiAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>2. Zakat Emas Murni ({goldWeightGrams} Gram, Haul 1 Th):</span>
                  <span className="font-mono font-bold text-white">
                    Rp {zakatGoldAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            {/* Total Display & One-Click Payment CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <div className="text-[11px] text-slate-400">Total Besaran Zakat yang Harus Dikeluarkan:</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 tabular-nums mt-0.5">
                  Rp {calculatedZakat.toLocaleString('id-ID')}
                </div>
              </div>

              <button
                onClick={() => onOpenPaymentModal(
                  zakatModalTitle,
                  calculatedZakat > 0 ? calculatedZakat : 500000
                )}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-slate-950" />
                <span>Tunaikan Zakat Digital Sekarang</span>
                <ArrowUpRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            {/* Tarjih Muhammadiyah Dalil / Source Tag */}
            <div className="text-[10px] text-slate-400 pt-2 border-t border-emerald-900/60 leading-relaxed flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Berdasarkan Putusan Tarjih PP Muhammadiyah: Zakat Profesi diqiyaskan pada zakat emas (nisab 85 gr emas/12 bulan, kadar 2.5% dikeluarkan setiap menerima pendapatan). Zakat emas simpanan wajib jika telah mencapai nisab 85 gram dan haul 1 tahun.
              </span>
            </div>
          </div>

        </div>

        {/* Right: Asnaf & Program Distribution Transparency (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.zakat.distributionLedger}
            </h3>
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penyaluran dana umat amanah diawasi oleh Dewan Pengawas Syariah Lazismu Pusat secara berkala.
          </p>

          <div className="space-y-3">
            {[
              { category: 'Fakir & Miskin (Pangan & Santunan)', pct: 42, color: 'bg-emerald-600' },
              { category: 'Fisabilillah & Beasiswa Sang Surya', pct: 24, color: 'bg-teal-600' },
              { category: 'Kebencanaan MDMC & Kemanusiaan', pct: 15, color: 'bg-amber-600' },
              { category: 'Pemberdayaan Ekonomi Mustahik / UMKM', pct: 11, color: 'bg-indigo-600' },
              { category: 'Amil & Operasional Pengelolaan', pct: 8, color: 'bg-slate-500' },
            ].map(item => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>{item.category}</span>
                  <span className="font-mono font-bold tabular-nums">{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-2">
            <div className="flex justify-between">
              <span>Opini Audit Keuangan Independen:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Wajar Tanpa Pengecualian (WTP)</span>
            </div>
            <div className="flex justify-between">
              <span>Indeks Transparansi Kemenag RI:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Nilai A (98.6/100)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Full Transaction Ledger with Search, Filtering, and Multi-Format Exports */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        
        {/* Ledger Header & Action Bar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {t.zakat.history}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Menampilkan {filteredTransactions.length} transaksi keagamaan & sosial tersertifikasi
            </span>
          </div>

          {/* Export Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => ExportService.exportTransactionsToCSV(transactions)}
              className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => {
                const flatData = transactions.map(t => ({
                  'Kode Transaksi': t.code,
                  'Muzakki/Donatur': t.donorName,
                  'NBM': t.donorNbm || '-',
                  'Program': t.program,
                  'Nominal': t.amount,
                  'Metode': t.paymentMethod,
                  'Status': t.status,
                  'Cabang': t.branch,
                  'Waktu': t.timestamp
                }));
                ExportService.exportToExcel(flatData, 'Laporan_ZISWAF_Muhammadiyah');
              }}
              className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xls)</span>
            </button>
            <button
              onClick={handleCopySheets}
              className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{sheetsCopied ? 'Format Sheets Disalin!' : 'Salin ke Google Sheets'}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={trxSearch}
              onChange={e => setTrxSearch(e.target.value)}
              placeholder="Cari kode transaksi, nama donatur, atau cabang..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Program:</span>
            <select
              value={trxProgramFilter}
              onChange={e => setTrxProgramFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
            >
              <option value="all">Semua Program</option>
              <option value="Zakat Maal">Zakat Maal</option>
              <option value="Zakat Profesi">Zakat Profesi</option>
              <option value="Infaq Kemanusiaan">Infaq Kemanusiaan</option>
              <option value="Wakaf Pendidikan">Wakaf Pendidikan</option>
              <option value="Bencana MDMC">Bencana MDMC</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="px-4 py-3">Kode Transaksi</th>
                <th className="px-4 py-3">Muzakki / Donatur</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3 text-right">Nominal</th>
                <th className="px-4 py-3">Metode Bayar</th>
                <th className="px-4 py-3">Cabang Penerima</th>
                <th className="px-4 py-3">Waktu Transaksi</th>
                <th className="px-4 py-3 text-center">Aksi Kwitansi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredTransactions.map(trx => (
                <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {trx.code}
                  </td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white">
                    <div>{trx.donorName}</div>
                    {trx.donorNbm && (
                      <div className="text-[10px] text-slate-400 font-mono">NBM: {trx.donorNbm}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {trx.program}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    Rp {trx.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {trx.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {trx.branch}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px] tabular-nums">
                    {trx.timestamp}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onPrintReceipt(trx)}
                      className="px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded flex items-center justify-center gap-1 mx-auto transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Cetak PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
