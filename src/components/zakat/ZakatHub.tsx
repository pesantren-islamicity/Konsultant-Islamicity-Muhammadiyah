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
  HeartHandshake
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

  // Calculator State
  const [calcType, setCalcType] = useState<'maal' | 'profesi' | 'fitrah' | 'perniagaan'>('profesi');
  
  // Maal inputs
  const [savingsWealth, setSavingsWealth] = useState<number>(150000000);
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(0);
  
  // Profesi inputs
  const [monthlyIncome, setMonthlyIncome] = useState<number>(15000000);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(6000000);
  
  // Fitrah inputs
  const [fitrahSouls, setFitrahSouls] = useState<number>(4);
  const [fitrahPricePerSoul, setFitrahPricePerSoul] = useState<number>(45000);

  // Perniagaan inputs
  const [businessAssets, setBusinessAssets] = useState<number>(300000000);
  const [businessDebts, setBusinessDebts] = useState<number>(80000000);

  // Constants
  const goldPricePerGram = 1450000;
  const nisabGold85g = 85 * goldPricePerGram; // Rp 123.250.000
  const nisabMonthlyIncome = nisabGold85g / 12; // ~Rp 10.270.833

  // Calculation logic
  let isObligated = false;
  let calculatedZakat = 0;

  if (calcType === 'maal') {
    const totalMaal = savingsWealth + goldWeightGrams * goldPricePerGram;
    isObligated = totalMaal >= nisabGold85g;
    calculatedZakat = isObligated ? Math.round(totalMaal * 0.025) : 0;
  } else if (calcType === 'profesi') {
    const netIncome = Math.max(0, monthlyIncome - monthlyExpense);
    isObligated = netIncome >= nisabMonthlyIncome;
    calculatedZakat = isObligated ? Math.round(netIncome * 0.025) : 0;
  } else if (calcType === 'fitrah') {
    isObligated = true;
    calculatedZakat = fitrahSouls * fitrahPricePerSoul;
  } else if (calcType === 'perniagaan') {
    const netBusiness = Math.max(0, businessAssets - businessDebts);
    isObligated = netBusiness >= nisabGold85g;
    calculatedZakat = isObligated ? Math.round(netBusiness * 0.025) : 0;
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
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.zakat.calculator}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Acuan Emas: Rp {goldPricePerGram.toLocaleString('id-ID')}/gr
            </span>
          </div>

          {/* Calculator Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setCalcType('profesi')}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                calcType === 'profesi'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Profesi / Gaji
            </button>
            <button
              onClick={() => setCalcType('maal')}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                calcType === 'maal'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Zakat Maal
            </button>
            <button
              onClick={() => setCalcType('fitrah')}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                calcType === 'fitrah'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Zakat Fitrah
            </button>
            <button
              onClick={() => setCalcType('perniagaan')}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                calcType === 'perniagaan'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Perniagaan
            </button>
          </div>

          {/* Dynamic Inputs based on calcType */}
          <div className="space-y-4">
            {calcType === 'profesi' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pendapatan Kotor Bulanan (Gaji, Tunjangan, Honorarium)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                    <input
                      type="number"
                      step="500000"
                      value={monthlyIncome}
                      onChange={e => setMonthlyIncome(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pengeluaran Kebutuhan Pokok Bulanan (Pangan, Tempat Tinggal, Utang Jatuh Tempo)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                    <input
                      type="number"
                      step="500000"
                      value={monthlyExpense}
                      onChange={e => setMonthlyExpense(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Nisab Profesi Bulanan: <strong>Rp {Math.round(nisabMonthlyIncome).toLocaleString('id-ID')}</strong> (Setara 85 gr emas / 12 bulan). Sesuai Putusan Tarjih Muhammadiyah.
                </div>
              </>
            )}

            {calcType === 'maal' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Saldo Tabungan, Deposito, & Aset Finansial Tersimpan (Telah Mencapai 1 Tahun / Haul)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                    <input
                      type="number"
                      step="1000000"
                      value={savingsWealth}
                      onChange={e => setSavingsWealth(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Simpanan Logam Mulia / Emas Murni (Gram)
                  </label>
                  <input
                    type="number"
                    value={goldWeightGrams}
                    onChange={e => setGoldWeightGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                    placeholder="Contoh: 100 gram"
                  />
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Nisab Zakat Maal: <strong>85 Gram Emas (Rp {nisabGold85g.toLocaleString('id-ID')})</strong>. Kadar zakat wajib 2.5%.
                </div>
              </>
            )}

            {calcType === 'fitrah' && (
              <>
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
                <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Setara 2.5 kg atau 3.5 liter beras per jiwa sesuai edaran resmi Lazismu dan Majelis Tarjih PP Muhammadiyah.
                </div>
              </>
            )}

            {calcType === 'perniagaan' && (
              <>
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
              </>
            )}
          </div>

          {/* Calculator Result Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs">
                {isObligated ? (
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.zakat.obligationYes}</span>
                  </span>
                ) : (
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    {t.zakat.obligationNo}
                  </span>
                )}
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                Rp {calculatedZakat.toLocaleString('id-ID')}
              </div>
            </div>

            <button
              onClick={() => onOpenPaymentModal(
                calcType === 'maal' ? 'Zakat Maal' : calcType === 'profesi' ? 'Zakat Profesi' : calcType === 'fitrah' ? 'Zakat Fitrah' : 'Zakat Maal',
                calculatedZakat > 0 ? calculatedZakat : 500000
              )}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.zakat.proceedPayment}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
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
